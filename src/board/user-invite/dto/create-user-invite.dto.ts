import { UserRole } from "../../user/dto/user-role.enum";

export class CreateUserInviteDto {
    public email: string;
    public role: UserRole;
}
