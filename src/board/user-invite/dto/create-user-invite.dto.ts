import { UserRole } from "../../user/dto/user-role.enum";

export class CreateUserInviteDto {
    public id?: string;
    public email: string;
    public role: UserRole;
}
