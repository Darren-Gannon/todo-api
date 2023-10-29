import { Module, forwardRef } from '@nestjs/common';
import { StateService } from './state.service';
import { StateController } from './state.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { State } from './entities/state.entity';
import { BoardModule } from '../../board/board.module';
import { Board } from '../../board/entities/board.entity';
import { Task } from '../task/entities/task.entity';

@Module({
  controllers: [StateController],
  providers: [StateService],
  imports: [
    BoardModule,
    SequelizeModule.forFeature([Board, State, Task]),
  ],
  exports: [StateService],
})
export class StateModule {}
