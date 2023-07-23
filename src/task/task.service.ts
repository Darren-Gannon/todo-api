import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Task } from './entities/task.entity';
import { BoardService } from '../board/board.service';
import { StateService } from '../state/state.service';

@Injectable()
export class TaskService {

  constructor(
    private boardService: BoardService,
    private stateService: StateService,
    @InjectModel(Task) private taskModel: typeof Task,
  ) { }
  async create(boardId: string, createTaskDto: CreateTaskDto): Promise<Task> {
    const [board, state] = await Promise.all([this.boardService.findOne(boardId), this.stateService.findOne(boardId, createTaskDto.stateId)]);
    return this.taskModel.create({
      title: createTaskDto.title,
      description: createTaskDto.description,
      boardId: board.id,
      stateId: state.id,
    })
  }

  findAll(boardId: string): Promise<Task[]> {
    return this.taskModel.findAll({
      where: {
        boardId,
      }
    })
  }

  findOne(boardId: string, id: string): Promise<Task> {
    return this.taskModel.findOne({
      where: {
        boardId,
        id,
      }
    })
  }

  async update(boardId: string, id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const original = await this.findOne(boardId, id);
    return original.update({
      title: updateTaskDto.title,
      description: updateTaskDto.description,
      stateId: updateTaskDto.stateId,
    });
  }

  async remove(boardId: string, id: string): Promise<Task> {
    const original = await this.findOne(boardId, id);
    await this.taskModel.destroy({
      where: { boardId, id },
    });
    return original;
  }
}
