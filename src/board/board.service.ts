import { Injectable } from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Board } from './entities/board.entity';

@Injectable()
export class BoardService {

  constructor(
    @InjectModel(Board) private boardModel: typeof Board,
  ) { }

  create(createBoardDto: CreateBoardDto): Promise<Board> {
    return this.boardModel.create({
      title: createBoardDto.title,
    });
  }

  findAll(): Promise<Board[]> {
    return this.boardModel.findAll();
  }

  findOne(id: string): Promise<Board> {
    return this.boardModel.findOne({
      where: { id },
    });
  }

  async update(id: string, updateBoardDto: UpdateBoardDto) {
    const original = await this.findOne(id);
    return original.update(updateBoardDto);
  }

  async remove(id: string): Promise<Board> {
    const original = await this.findOne(id);
    await this.boardModel.destroy({
      where: { id },
    });
    return original;
  }
}
