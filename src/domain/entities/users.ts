export class User {
  constructor(
    public readonly name: string,
    public readonly address: string,
    public readonly phone: string,
    public readonly email: string,
    public readonly password: string,
    public readonly avatar: string,
    public readonly isActive: boolean
  ) {
  }
}
