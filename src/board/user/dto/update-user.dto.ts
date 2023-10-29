import { User } from "auth0";
import { UserRole } from './user-role.enum';

export class UpdateUserDto {
    constructor(
        public readonly role: UserRole,
    ) { }
}
