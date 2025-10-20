import { IQuery } from '@nestjs/cqrs';

export class GetOneBannerQuery implements IQuery {
  constructor(public readonly id: number) {}
}