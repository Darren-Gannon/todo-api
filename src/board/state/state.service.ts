import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { BoardService } from '../../board/board.service';
import { Board } from '../../board/entities/board.entity';
import { CreateStateDto } from './dto/create-state.dto';
import { UpdateStateDto } from './dto/update-state.dto';
import { State } from './entities/state.entity';
import { v4 as uuid } from 'uuid'

@Injectable()
export class StateService {

  constructor(
    private boardService: BoardService,
    @InjectModel(State) private stateModel: typeof State,
  ) { }

  async create(boardId: string, createStateDto: CreateStateDto): Promise<State> {
    const [board, prevState] = await Promise.all([
      this.boardService.findOne(boardId),
      this.stateModel.findOne({
        where: {
          boardId: boardId,
          nextStateId: { [Op.eq]: null },
        }
      }),
    ]);

    const newState = await this.stateModel.create({
      title: createStateDto.title,
      boardId: board.id,
      nextStateId: null,
    })

    if (prevState)
      await prevState.update({ nextStateId: newState.dataValues.id });

    return newState;
  }

  async createMany(boardId: string, createStateDtos: CreateStateDto[]): Promise<State[]> {
    const [board, prevState] = await Promise.all([
      this.boardService.findOne(boardId),
      this.stateModel.findOne({
        where: {
          boardId: boardId,
          nextStateId: { [Op.eq]: null },
        }
      }),
    ]);
    
    const statesToCreate: {
      id: string;
      title: string;
      boardId: string;
      nextStateId: string | null;
    }[] = createStateDtos.map((createStateDtos, index, arr) => ({
      id: uuid(),
      title: createStateDtos.title,
      boardId: board.id,
      nextStateId: null,
    }));

    statesToCreate.forEach((state, index, arr) => {
      state.nextStateId = arr[index + 1]?.id;
    })

    return this.stateModel.bulkCreate(statesToCreate)
  }

  async findAll(boardId: Board['id']): Promise<State[]> {
    const states = await this.stateModel.findAll({
      where: {
        boardId,
      },
    });

    const statesMap = new Map<string, State>();
    const stateNextIds = states.map(state => {
      statesMap.set(state.dataValues.id, state);
      return state.dataValues.nextStateId;
    });

    let currentState = states.find(state => !stateNextIds.includes(state.dataValues.id))
    if(!currentState) return [];
    const retStates: State[] = [];
    do {
      retStates.push(currentState);
      currentState = statesMap.get(currentState.dataValues.nextStateId);
    } while(currentState != null);

    return retStates.map((state, index) => {
      state.orderIndex = index;
      return state;
    });
  }

  findOne(boardId: Board['id'], id: State['id']): Promise<State> {
    return this.stateModel.findOne({
      where: {
        boardId,
        id,
      },
    });
  }

  async update(boardId: Board['id'], id: State['id'], updateStateDto: UpdateStateDto) {
    const state = await this.findOne(boardId, id);
    return state.update({
      title: updateStateDto.title,
    });
  }

  async remove(boardId: Board['id'], id: State['id']): Promise<State> {

    const state = await this.findOne(boardId, id);

    // Find previous state
    const previousState = await this.stateModel.findOne({
      where: {
        boardId: boardId,
        nextStateId: state.dataValues.id,
      }
    });
    // replace previous next state with current next state
    if (previousState)
      await previousState.update({ nextStateId: state.dataValues.nextStateId });
    // delete current
    await state.destroy();

    return state;
  }
}

