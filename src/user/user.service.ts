import { ForbiddenException, Injectable, MethodNotAllowedException, NotFoundException } from '@nestjs/common';
import { ManagementClient } from 'auth0';
import { AuthPayload } from '../authz/auth.decorator';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {

  constructor(
    private readonly client: ManagementClient,
  ) { }

  findAll() {
    return this.client.getUsers({
      fields: 'email,name,family_name,given_name,picture,user_id',
      q: `user_metadata.isPublic:true`
    })
  }

  async findOne(id: string, auth: AuthPayload) {
    const user = await this.client.getUser({
      id,
    });

    // If the user account is not public, and it is not the user viewing their own account, then dont display;
    if(!user.user_metadata.isPublic && user.user_id !== auth.sub)
      throw new NotFoundException();

    return ({
      user_id: user.user_id,
      email: user.email,
      name: user.name,
      family_name: user.family_name,
      given_name: user.given_name,
      picture: user.picture,
    });
  }

  async update(updateUserDto: UpdateUserDto, auth: AuthPayload) {
    const user = await this.client.updateUserMetadata({
      id: auth.sub,
    }, {
      isPublic: updateUserDto.isPublic,
    });

    return ({
      user_id: user.user_id,
      email: user.email,
      name: user.name,
      family_name: user.family_name,
      given_name: user.given_name,
      picture: user.picture,
    });
  }

  remove(auth: AuthPayload) {
    throw new MethodNotAllowedException('This action is not implemented');
  }
}
