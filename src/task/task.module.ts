import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Task } from './entities/task.entity';
import { State } from '../state/entities/state.entity';
import { Board } from '../board/entities/board.entity';
import { BoardModule } from '../board/board.module';
import { StateModule } from '../state/state.module';

@Module({
  controllers: [TaskController],
  providers: [TaskService],
  imports: [
    BoardModule,
    StateModule,
    SequelizeModule.forFeature([Board, State, Task]),
  ],
})
export class TaskModule {}
