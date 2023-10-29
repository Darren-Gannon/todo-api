import { Table, Column, Model, PrimaryKey, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Board } from '../../../board/entities/board.entity';

@Table
export class State extends Model {
    @PrimaryKey
    @Column({ 
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
    })
    public id: string;

    @Column
    public title: string;
    
    @Column({ 
        type: DataType.UUID,
    })
    @ForeignKey(() => State)
    public nextStateId: State['id']

    @BelongsTo(() => State)
    nextState?: State;

    @ForeignKey(() => Board)
    public boardId: Board['id']

    @BelongsTo(() => Board)
    public board: Board;

    public orderIndex: number;
}
