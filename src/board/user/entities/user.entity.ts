import { Table, Column, Model, PrimaryKey, DataType, CreatedAt, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { Board } from '../../entities/board.entity';
import { UserRole } from '../dto/user-role.enum';

@Table({
    tableName: 'BoardUsers'
})
export class User extends Model {

    @PrimaryKey
    @Column({ 
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
    })
    public id: string;
    
    @Column
    public userId: string;

    @Column
    public role: UserRole;

    @CreatedAt
    public createdAt: Date;

    @ForeignKey(() => Board)
    public boardId: Board['id']

    @BelongsTo(() => Board)
    public board: Board;
}
