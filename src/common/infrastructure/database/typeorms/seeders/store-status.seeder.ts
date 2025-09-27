import { Inject, Injectable } from '@nestjs/common';
import { HelperSeeder } from './helper.seeder';
import { EntityManager } from 'typeorm';
import { SeederLogOrmEntity } from '../entities/seeder-log.orm';
import moment from 'moment-timezone';
import { Timezone } from '@src/common/value-objects/timezone.vo';
import { DateFormat } from '@src/common/value-objects/format-date.vo';
import { StoreStatusOrmEntity } from '../entities/store-status.orm';

@Injectable()
export class StoreStatusSeeder {
  private readonly SEEDER_NAME = 'store_status_seeder';

  constructor(@Inject() private readonly _helper: HelperSeeder) {}

  async seed(manager: EntityManager) {
    const seederLogRepo = manager.getRepository(SeederLogOrmEntity);
    const done = await this._helper.existingLog(
      this.SEEDER_NAME,
      seederLogRepo,
    );
    if (done) return;

    const _respository = manager.getRepository(StoreStatusOrmEntity);
    const currentDateTime = moment
      .tz(Timezone.LAOS)
      .format(DateFormat.DATETIME_FORMAT);

    const items = [
      {
        name: 'pending',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'open',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'close',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
    ];

    for (const item of items) {
      const existingItem = await _respository.findOne({
        where: { name: item.name },
      });
      if (!existingItem) {
        const items = _respository.create(item);
        await _respository.save(items);
      }
    }
    await this._helper.executingLog(this.SEEDER_NAME, seederLogRepo);
  }
}
