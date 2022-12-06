import { Repository, SelectQueryBuilder } from 'typeorm';
import { RoomModel } from '../../infrastructure/data-access/typeorm';
import { CustomRepository } from 'src/infrastructure/data-access/typeorm-custom/typeorm-ex.decorator';
import { QueryGetRoomsByLocation, GetRoomsByLocationDTO, RoomDetailResponseDTO } from './dto/manage-room.dto';

@CustomRepository(RoomModel)
export class ManageRoomRepository extends Repository<RoomModel> {
    private alias = 'room';

    private createBuilder(): SelectQueryBuilder<RoomModel> {
        return this.createQueryBuilder(`${this.alias}`);
    }

    private calculateDistance({ lng, lat, distance }) {
        const { alias } = this;
        const dataSelected = [
            `${alias}.*`,
            `6371 * acos(cos(radians(${lat})) *  cos(radians(location[0])) * cos(radians(location[1]) - radians(${lng})) + sin(radians(${lat})) * sin(radians(location[0]))) as distance`,
        ];

        return this.createBuilder()
            .select(`${alias}.*, d.distance as distance`)
            .innerJoin(
                (qb) => qb
                    .from(RoomModel, 'room')
                    .select(`${dataSelected}, room.room_id as id`),
                'd',
                'd.id = room.room_id',
            )
            .where('d.distance < :range', { range: distance })
            .orderBy('d.distance', 'ASC')
            .getRawMany();
    }

    private async findOneAndUpdateByRoomId({ status_id, room_id }) {
        const room = await this.createBuilder()
            .update(RoomModel)
            .set({ statusId: status_id })
            .where('room_id = :room_id', { room_id })
            .returning('*')
            .execute()
            .then((res) => {
                return res.raw[0];
            });

        return { room };
    }

    getRoomsByLocation({ lng, lat, distance }: QueryGetRoomsByLocation): Promise<GetRoomsByLocationDTO[]> {
        return this.calculateDistance({ lng, lat, distance });
    }

    getRoomAndUpdate({ status_id, room_id }: any): Promise<any> {
        return this.findOneAndUpdateByRoomId({ status_id, room_id });
    }

}
