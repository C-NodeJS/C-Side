import { BadRequestException } from '@nestjs/common';

export class RoomDoesNotExists extends BadRequestException {
  constructor(objectOrError?: string | object | any, description?: string) {
    objectOrError = {
      code: objectOrError?.code || 1,
      message: objectOrError?.message || 'Room does not exist!',
    };
    super(objectOrError, description);
  }
}
