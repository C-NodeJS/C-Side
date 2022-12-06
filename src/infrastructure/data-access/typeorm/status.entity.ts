import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { RoomModel } from '.';
import { ConfirmationBookingStatus } from './enum';

@Entity({ name: 'status' })
export class StatusModel {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column({
        name: 'status_name',
        type: 'enum',
        enum: ConfirmationBookingStatus,
    })
    statusName: string;

    room?: RoomModel;
}
