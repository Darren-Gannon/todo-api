import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './entities/user.entity';
import { AuthPayload } from '../../authz/auth.decorator';
import { lastValueFrom } from 'rxjs';
import { PermissionService } from '../../authz-management';
import { ManagementClient } from 'auth0';
import { Board } from '../entities/board.entity';
import { UserModuleConfig } from './user.module-config';
import { UserRole } from './dto/user-role.enum';

@Injectable()
export class UserService {

  constructor(
    @InjectModel(User) private readonly userModel: typeof User,
    private readonly permissionService: PermissionService,
    private readonly client: ManagementClient,
    private readonly config: UserModuleConfig,
  ) { }

  async create(boardId: string, createUserDto: CreateUserDto, auth: AuthPayload) {
    const user = await this.userModel.create({
      userId: createUserDto.userId,
      role: createUserDto.role,
      boardId: boardId,
    })
    const updatedPermissions = await this.updateUserPermissions(boardId, user);
    // TODO Inject live user data
    return user;
  }

  async findAll(boardId: string, auth: AuthPayload) {

    // TODO Inject live user data
    const users = await this.userModel.findAll({
      where: {
        boardId,
      }
    });

    const authUsers = await this.client.getUsers();

    const mappedUsers = users.map(user => {
      const authUser = authUsers.find(authUser => authUser.user_id == user.dataValues.userId)
      return {
        ...user.dataValues,
        email: authUser.email,
        family_name: authUser.family_name,
        given_name: authUser.given_name,
        name: authUser.name,
        picture: authUser.picture,
      }
    })
    return mappedUsers;
  }

  async findOne(boardId: string, id: string, auth: AuthPayload) {
    
    // TODO Inject live user data
    return this.userModel.findOne({
      where: {
        id,
        boardId,
      }
    })
  }

  async update(boardId: string, id: string, updateUserDto: UpdateUserDto, auth: AuthPayload) {
    // TODO 
    throw `This action updates a #${id} user`;
  }

  remove(boardId: string, id: string, auth: AuthPayload) {
    // TODO 
    throw `This action removes a #${id} user`;
  }

  public createBoardPermissions(board: Board) { 
    return lastValueFrom(this.permissionService.createPermissions([
      {
        value: `board:${ board.id }:read`,
        description: `Ability to read board ${ board.id }`
      },
      {
        value: `board:${ board.id }:write`,
        description: `Ability to update board ${ board.id }`
      },
      {
        value: `board:${ board.id }:state:read`,
        description: `Ability to read board ${ board.id } states`
      },
      {
        value: `board:${ board.id }:state:write`,
        description: `Ability to update board ${ board.id } states`
      },
      {
        value: `board:${ board.id }:task:read`,
        description: `Ability to read board ${ board.id } tasks`
      },
      {
        value: `board:${ board.id }:task:write`,
        description: `Ability to update board ${ board.id } tasks`
      },
      {
        value: `board:${ board.id }:user:read`,
        description: `Ability to read board ${ board.id } users`
      },
      {
        value: `board:${ board.id }:user:write`,
        description: `Ability to update board ${ board.id } users`
      },
    ]));
  }

  private async updateUserPermissions(boardId: string, user: User): Promise<void> {
    const [
      BOARD_READ,
      BOARD_WRITE,
      BOARD_STATE_READ,
      BOARD_STATE_WRITE,
      BOARD_TASK_READ,
      BOARD_TASK_WRITE,
      BOARD_USER_READ,
      BOARD_USER_WRITE,
    ] = buildPermissions(boardId, this.config.audience);

    const ADMIN_PERMISSIONS: [Permission[], Permission[]] = [[
      BOARD_READ,
      BOARD_WRITE,
      BOARD_STATE_READ,
      BOARD_STATE_WRITE,
      BOARD_TASK_READ,
      BOARD_TASK_WRITE,
      BOARD_USER_READ,
      BOARD_USER_WRITE,
    ], []];

    const MEMBER_PERMISSIONS: [Permission[], Permission[]] = [[
      BOARD_READ,
      BOARD_STATE_READ,
      BOARD_TASK_READ,
      BOARD_TASK_WRITE,
      BOARD_USER_READ,
    ], [      
      BOARD_WRITE,
      BOARD_STATE_WRITE,
      BOARD_USER_WRITE,
    ]];

    const SPECTATOR_PERMISSIONS: [Permission[], Permission[]] = [[
      BOARD_READ,
      BOARD_STATE_READ,
      BOARD_TASK_READ,
    ], [      
      BOARD_WRITE,
      BOARD_STATE_WRITE,
      BOARD_TASK_WRITE,
      BOARD_USER_READ,
      BOARD_USER_WRITE,
    ]];

    const permissionMap = new Map<UserRole, [Permission[], Permission[]]>([
      [UserRole.SPECTATOR, SPECTATOR_PERMISSIONS],
      [UserRole.MEMBER, MEMBER_PERMISSIONS],
      [UserRole.ADMIN, ADMIN_PERMISSIONS],
    ])

    const permissions = permissionMap.get(user.role);
    if(!permissions) throw new Error("Unrecognised UserRole");
    const [permissionsToGrant, permissionsToRemove] = permissions;

    const permissionPromises: Promise<unknown>[] = [];

    if(permissionsToGrant.length > 0)
      permissionPromises.push(this.client.assignPermissionsToUser({
          id: user.userId,
        }, {
          permissions: permissionsToGrant,
        }))
    if(permissionsToRemove.length > 0)
      permissionPromises.push(this.client.removePermissionsFromUser({
        id: user.userId,
      }, {
        permissions: permissionsToRemove,
      }))
    await Promise.allSettled(permissionPromises)
  }
}

interface Permission {
  permission_name: string;
  resource_server_identifier: string;
}

function buildPermissions(boardId: string, resourceServerIdentifier: string): Permission[] {
  return [
    {
      permission_name: `board:${ boardId }:read`,
      resource_server_identifier: resourceServerIdentifier,
    },
    {
      permission_name: `board:${ boardId }:write`,
      resource_server_identifier: resourceServerIdentifier,
    },
    {
      permission_name: `board:${ boardId }:state:read`,
      resource_server_identifier: resourceServerIdentifier,
    },
    {
      permission_name: `board:${ boardId }:state:write`,
      resource_server_identifier: resourceServerIdentifier,
    },
    {
      permission_name: `board:${ boardId }:task:read`,
      resource_server_identifier: resourceServerIdentifier,
    },
    {
      permission_name: `board:${ boardId }:task:write`,
      resource_server_identifier: resourceServerIdentifier,
    },
    {
      permission_name: `board:${ boardId }:user:read`,
      resource_server_identifier: resourceServerIdentifier,
    },
    {
      permission_name: `board:${ boardId }:user:write`,
      resource_server_identifier: resourceServerIdentifier,
    }
  ]
}