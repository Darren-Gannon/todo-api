import { Injectable } from '@nestjs/common';
import { CreateStateDto } from './dto/create-state.dto';
import { UpdateStateDto } from './dto/update-state.dto';
import { BoardService } from '../board/board.service';
import { InjectModel } from '@nestjs/sequelize';
import { State } from './entities/state.entity';
import { Board } from '../board/entities/board.entity';

@Injectable()
export class StateService {

  constructor(
    private boardService: BoardService,
    @InjectModel(State) private stateModel: typeof State,
  ) { }

  async create(boardId: string, createStateDto: CreateStateDto): Promise<State> {
    const [board, states] = await Promise.all([this.boardService.findOne(boardId), await this.findAll(boardId)]);

    return this.stateModel.create({
      title: createStateDto.title,
      boardId: board.id,
      orderIndex: states.length,
    })
  }

  findAll(boardId: Board['id']): Promise<State[]> {
    return this.stateModel.findAll({
      where: {
        boardId,
      },
      order: [
        ['orderIndex', 'ASC']
      ]
    })
  }

  findOne(boardId: Board['id'], id: State['id']): Promise<State> {
    return this.stateModel.findOne({
      where: {
        boardId,
        id,
      },
    })
  }

  async update(boardId: Board['id'], id: State['id'], updateStateDto: UpdateStateDto) {
    const original = await this.findOne(boardId, id);
    return original.update({
      title: updateStateDto.title,
    });
  }

  async swapStates(boardId: Board['id'], aId: State['id'], bId: State['id']): Promise<State[]> {
    const states = await this.findAll(boardId);
    const aIndex = states.findIndex(state => state.id == aId);
    const bIndex = states.findIndex(state => state.id == bId);
    const minIndex = Math.min(aIndex, bIndex);
    const maxIndex = Math.max(aIndex, bIndex);
    const leading = states.slice(0, minIndex);
    const mid = states.slice(minIndex, maxIndex+1);
    const trailing = states.slice(maxIndex+1);
    const val = mid.shift();
    const midMod = mid.map(item => {
      item.orderIndex--
      return item;
    });
    if(val)
      val.orderIndex = midMod[midMod.length - 1].orderIndex + 1;
    midMod.push(val!);
    const updated = await Promise.all(midMod.map(item => item.save()))
    return [...leading, ...updated, ...trailing];
  }

  async remove(boardId: Board['id'], id: State['id']): Promise<State> {
    const original = await this.findOne(boardId, id);
    await this.stateModel.destroy({
      where: { boardId, id },
    });
    return original;
  }
}
