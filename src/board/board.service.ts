import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { ManagementClient } from 'auth0';
import { v4 as uuid } from 'uuid';
import { PermissionService } from '../authz-management';
import { AuthPayload } from '../authz/auth.decorator';
import { NotificationType } from '../notification/dto/notification-type.enum';
import { NotificationService } from '../notification/notification.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { Board } from './entities/board.entity';
import { UserRole } from './user/dto/user-role.enum';
import { User } from './user/entities/user.entity';
import { UserService } from './user/user.service';

@Injectable()
export class BoardService {

  constructor(
    @InjectModel(Board) private readonly boardModel: typeof Board,
    @InjectModel(User) private readonly userModel: typeof User,
    private readonly client: ManagementClient,
    private readonly permissionService: PermissionService,
    private readonly notificationService: NotificationService,
    private readonly userService: UserService,
  ) { }

  async create(
    createBoardDto: CreateBoardDto,
    auth: AuthPayload,
  ): Promise<Board> {
    const id = createBoardDto.id ?? uuid();
    const board = await this.boardModel.create({
      id,
      title: createBoardDto.title,
    });
    
    await this.userService.createBoardPermissions(board);
    
    await this.notificationService.create({
      title: `Board '${ createBoardDto.title }' created`,
      type: NotificationType.CREATE_BOARD,
      data: JSON.stringify({
        board,
      }),
    }, [auth.sub], auth);

    await this.userService.create(board.id, {
      role: UserRole.ADMIN,
      userId: auth.sub,
    }, auth);

    return board;
  }

  async findAll(auth: AuthPayload): Promise<Board[]> {
    const users = await this.userModel.findAll({
      where: {
        userId: auth.sub,
      }
    });

    const boardIds = users.map(user => user.boardId);
    return this.boardModel.findAll({
      where: {
        id: boardIds
      }
    });
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
