import { Table, Column, Model, PrimaryKey, DataType, CreatedAt, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { Board } from '../../../board/entities/board.entity';
import { State } from '../../state/entities/state.entity';

@Table
export class Task extends Model {
    @PrimaryKey
    @Column({ 
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
    })
    public id: string;

    @Column
    public title: string;
    
    @Column
    public description: string;

    @CreatedAt
    public createdAt: Date;

    @ForeignKey(() => Board)
    public boardId: Board['id']

    @BelongsTo(() => Board)
    public board: Board;

    @ForeignKey(() => State)
    public stateId: State['id']

    @BelongsTo(() => State)
    public state: State;
}
