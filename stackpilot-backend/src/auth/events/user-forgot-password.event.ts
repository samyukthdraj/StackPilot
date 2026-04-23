export class UserForgotPasswordEvent {
  constructor(
    public readonly email: string,
    public readonly name: string,
    public readonly token: string,
  ) {}
}
