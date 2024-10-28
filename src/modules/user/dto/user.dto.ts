export default class UserDto {
  constructor(
    public id: number,
    public login: string,
    public lastLogin: number,
  ) {}
}
