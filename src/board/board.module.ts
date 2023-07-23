import { Module } from '@nestjs/common';
import { BoardService } from './board.service';
import { BoardController } from './board.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Board } from './entities/board.entity';

@Module({
  controllers: [BoardController],
  providers: [BoardService],
  imports: [SequelizeModule.forFeature([Board])],
  exports: [BoardService],
})
export class BoardModule {}
