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
    const [board, prevOrderIndex] = await Promise.all([
      this.boardService.findOne(boardId),
      this.stateModel.max('orderIndex', {
        where: {
          boardId: boardId,
        }
      }) as Promise<number|null>,
    ]);

    const newState = await this.stateModel.create({
      id: createStateDto.id ?? uuid(),
      title: createStateDto.title,
      boardId: board.id,
      orderIndex: (prevOrderIndex ?? 0) + 1,
    });

    return newState;
  }

  async createMany(boardId: string, createStateDtos: CreateStateDto[]): Promise<State[]> {
    const [board, prevOrderIndex] = await Promise.all([
      this.boardService.findOne(boardId),
      this.stateModel.max('orderIndex', {
        where: {
          boardId: boardId,
        }
      }) as Promise<number|null>,
    ]);
    
    
    const statesToCreate = createStateDtos.map((createStateDto, index) => ({
      id: createStateDto.id ?? uuid(),
      title: createStateDto.title,
      boardId: board.id,
      orderIndex: (prevOrderIndex ?? 0) + index,
    }));

    return this.stateModel.bulkCreate(statesToCreate)
  }

  async findAll(boardId: Board['id']): Promise<State[]> {
    const states = await this.stateModel.findAll({
      where: {
        boardId,
      },
      order: [['orderIndex', 'ASC']],
    });

    return states;
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
    if (!state)
      throw new NotFoundException();

    await state.destroy();

    return state;
  }
}

