import { Repository, SelectQueryBuilder } from 'typeorm';
import { RoomModel } from '../../infrastructure/data-access/typeorm';
import { CustomRepository } from 'src/infrastructure/data-access/typeorm-custom/typeorm-ex.decorator';
import { QueryGetRoomByLocation, GetRoomByLocationDTO } from './dto/manage_room.dto';

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

    async getRoomByLocation({ lng, lat, distance }: QueryGetRoomByLocation): Promise<GetRoomByLocationDTO[]> {
        return this.calculateDistance({ lng, lat, distance });
    }
}