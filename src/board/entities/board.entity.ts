import { Column, DataType, Model, PrimaryKey, Table } from 'sequelize-typescript';

@Table
export class Board extends Model {
    @PrimaryKey
    @Column({ 
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
    })
    public id: string;

    @Column
    public title: string;
}
