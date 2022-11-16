export interface IInputBoundary<G extends IService, R extends IRequest> {
  execute(gateway: G, request: R): void;
}
