import { BelongsTo, Column, CreatedAt, DataType, ForeignKey, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { UserRole } from '../../user/dto/user-role.enum';
import { Board } from '../../entities/board.entity';

@Table({
    tableName: 'BoardUserInvites'
})
export class UserInvite extends Model {
    @PrimaryKey
    @Column({ 
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
    })
    public id: string;

    @Column
    public email: string;

    @Column
    public boardTitle: string;

    @Column
    public role: UserRole;

    @ForeignKey(() => Board)
    public boardId: Board['id']

    @BelongsTo(() => Board)
    public board: Board;

    @CreatedAt
    public createdAt: Date;
}
