import { User } from "auth0";
import { UserRole } from "./user-role.enum";

export class CreateUserDto {
    constructor(
        public readonly userId: User['user_id'],
        public readonly role: UserRole,
    ) { }
}
