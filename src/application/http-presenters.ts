import { HttpException, HttpStatus } from '@nestjs/common';
import { IOutputBoundary } from '../domain/core/interfaces/output-boundary';

//Packages
import { Response } from 'express';

export interface HttpResponse {
  statusCode: HttpStatus;
  message: string;
  response?: Record<string, any>;
  error?: string;
}

export class HttpPresenter<S extends IResponse, E extends HttpException> implements IOutputBoundary<S, E> {
  private message: string;
  private status: HttpStatus;
  private data: S;
  private error: E;

  constructor(private response: Response) { }

  accept(
    data: S,
    status: HttpStatus = HttpStatus.OK,
    message: string = 'Success!'
  ): this {
    this.status = status;
    this.data = data;
    this.message = message;
    return this;
  }

  reject(error: E): this {
    this.status = error.getStatus();
    this.error = error;
    this.message = error.message;
    return this;
  }

  render(): void {
    if (this.error)
      this.response.json({
        statusCode: this.status,
        message: this.message,
        error: this.error.name,
      } as HttpResponse);
    else
      this.response.json({
        statusCode: this.status,
        message: this.message,
        response: this.data,
      } as HttpResponse);
  }
}
