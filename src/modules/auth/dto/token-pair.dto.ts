export default class TokenPairDto {
  constructor(
    public accessToken: string,
    public refreshToken: string,
  ) {
  }
}