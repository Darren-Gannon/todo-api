import { Column, CreatedAt, DataType, Model, PrimaryKey, Table, UpdatedAt } from 'sequelize-typescript';
import { NotificationType } from '../dto/notification-type.enum';

@Table
export class Notification extends Model {
    @PrimaryKey
    @Column({ 
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
    })
    public id: string;

    @Column
    public title: string;

    @Column
    public userId: string;

    @Column({
        defaultValue: false,
    })
    public read: boolean;
    
    @Column
    public type: NotificationType;
    
    @Column({
        type: DataType.TEXT('long'),
    })
    public data: string;

    @CreatedAt
    createdAt: Date;

    @UpdatedAt
    updatedAt: Date;
}
