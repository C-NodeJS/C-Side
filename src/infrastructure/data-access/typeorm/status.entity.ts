import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { RoomModel } from '.';
import { RoomApprovalStatus } from './enum';

@Entity({ name: 'status' })
export class StatusModel {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column({
        name: 'status_name',
        type: 'enum',
        enum: RoomApprovalStatus,
    })
    statusName: string;

    room?: RoomModel;
}
