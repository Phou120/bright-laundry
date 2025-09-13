export interface IAuthRepository {
  signIn(body: any): Promise<string>;
}
