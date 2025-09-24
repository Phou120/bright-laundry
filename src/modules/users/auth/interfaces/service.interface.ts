import { EntityManager } from 'typeorm';
import { AuthDto } from '../dtos/auth.dto';

export interface IAuthServiceInterface {
  signIn(body: AuthDto, manager?: EntityManager): Promise<string>;
  signOut(user_id: number, manager?: EntityManager): Promise<string>;
}
