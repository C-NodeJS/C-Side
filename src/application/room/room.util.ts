import { RoomModel } from '../../infrastructure/data-access/typeorm/room.entity';

export class RoomUtil {
  static getRoomModel(roomData: any): RoomModel {
    const roomModel = new RoomModel();
    roomModel.roomId = roomData.room_id || roomData.roomId || null;
    roomModel.name = roomData.name || null;
    roomModel.address = roomData.address || null;
    roomModel.capacity = roomData.capacity || null;
    roomModel.location =
      `${roomData.location.lat}, ${roomData.location.lng}` || //TODO refactor later
      roomData.location ||
      null;
    roomModel.status = roomData.status || null;
    roomModel.price = roomData.price || null;
    roomModel.description = roomData.description || null;
    roomModel.image = roomData.image || null;
    roomModel.rating = roomData.rating || null;
    roomModel.isActive = roomData.isActive || roomData.is_active || null;
    return roomModel;
  }
}
