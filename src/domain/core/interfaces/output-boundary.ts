import { HttpException } from "@nestjs/common";

export interface IOutputBoundary<S extends IResponse, E extends HttpException> {
  accept(response: S): void;

  reject(response: E): void;
}
