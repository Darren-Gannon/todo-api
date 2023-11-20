import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AuthPayload } from '../../authz/auth.decorator';
import { NotificationType } from '../../notification/dto/notification-type.enum';
import { NotificationService } from '../../notification/notification.service';
import { Board } from '../entities/board.entity';
import { CreateUserInviteDto } from './dto/create-user-invite.dto';
import { UpdateUserInviteDto } from './dto/update-user-invite.dto';
import { UserInvite } from './entities/user-invite.entity';
import { AppMetadata, ManagementClient, User, UserMetadata } from 'auth0';
import { UserService } from '../user/user.service';
import { v4 as uuid } from 'uuid';

@Injectable()
export class UserInviteService {

  constructor(
    @InjectModel(UserInvite) private readonly userInviteModel: typeof UserInvite,
    @InjectModel(Board) private readonly boardModel: typeof Board,
    private readonly notificationService: NotificationService,
    private readonly client: ManagementClient,
    private readonly userService: UserService,
  ) { }

  async create(boardId: string, createUserInviteDto: CreateUserInviteDto, auth: AuthPayload): Promise<UserInvite> {
    const board = await this.boardModel.findOne({
      where: {
        id: boardId,
      }
    })

    if(!board)
      throw new NotFoundException();

    const invite = await this.userInviteModel.create({
      id: createUserInviteDto.id ?? uuid(),
      boardId: boardId,
      boardTitle: board.title,
      email: createUserInviteDto.email,
      role: createUserInviteDto.role
    });

    // check if user is registered
    const [user] = await this.client.getUsersByEmail(createUserInviteDto.email)
    if(user) {
      this.notificationService.create({
        title: `You have been invited to join board ${ board.dataValues.title }`,
        data: JSON.stringify({ invite }),
        type: NotificationType.INVITE_USER,
      }, [user.user_id], auth); // Dont need to await
    }

    return invite;
  }

  findAllForBoard(boardId: string) {
    return this.userInviteModel.findAll({
      where: {
        boardId: boardId,
      }
    });
  }

  async findOneForBoard(boardId: string, id: string) {
    const invite = await this.userInviteModel.findOne({
      where: {
        id: id,
        boardId: boardId,
      }
    });
    
    if(!invite)
      throw new NotFoundException();

    return invite;
  }

  async updateForBoard(boardId: string, id: string, updateUserInviteDto: UpdateUserInviteDto) {
    const invite = await this.findOneForBoard(boardId, id);

    await invite.update({
      role: updateUserInviteDto.role,
    });

    return invite;
  }

  async removeForBoard(boardId: string, id: string) {
    const invite = await this.findOneForBoard(boardId, id);

    await invite.destroy();

    return invite;
  }

  async findAllForUser(auth: AuthPayload) {
    const user = await this.client.getUser({
      id: auth.sub,
    });
    
    return this.userInviteModel.findAll({
      where: {
        email: user.email,
      }
    });
  }

  async findOneForUser(id: string, auth: AuthPayload) {
    const user = await this.client.getUser({
      id: auth.sub,
    });
    
    const invite = await this.userInviteModel.findOne({
      where: {
        id: id,
        email: user.email,
      }
    });

    if(!invite)
      throw new NotFoundException();

    return invite;
  }

  async approveForUser(id: string, auth: AuthPayload) {
    const invite = await this.findOneForUser(id, auth)
    if(!invite)
      throw new NotFoundException();
    const user = await this.userService.create(invite.boardId, {
      userId: auth.sub,
      role: invite.role,
    }, auth);
    await invite.destroy();
    return user;
  }

  async removeForUser(id: string, auth: AuthPayload) {
    const invite = await  this.findOneForUser(id, auth);

    await invite.destroy();

    return invite;
  }
}
