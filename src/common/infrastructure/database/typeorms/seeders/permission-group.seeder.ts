import { DateFormat } from '@src/common/value-objects/format-date.vo';
import moment from 'moment-timezone';
import { PermissionGroupOrmEntity } from '../entities/permission-group.orm';
import { SeederLogOrmEntity } from '../entities/seeder-log.orm';
import { EntityManager } from 'typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { HelperSeeder } from './helper.seeder';
import { Timezone } from '@src/common/value-objects/timezone.vo';
import { EnumType } from '@src/common/enums/orm-entity-method.enum';

@Injectable()
export class PermissionGroupSeeder {
  private readonly SEEDER_NAME = 'permission_group_seeders';

  constructor(@Inject() private readonly _helper: HelperSeeder) {}

  async seed(manager: EntityManager) {
    const seederLogRepository = manager.getRepository(SeederLogOrmEntity);
    const isExecute = await this._helper.existingLog(
      this.SEEDER_NAME,
      seederLogRepository,
    );
    if (isExecute) return [];
    const _respository = manager.getRepository(PermissionGroupOrmEntity);
    const currentDateTime = moment
      .tz(Timezone.LAOS)
      .format(DateFormat.DATETIME_FORMAT);

    const items = [
      {
        name: 'user',
        display_name: 'User',
        type: EnumType.ADMIN,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'role',
        display_name: 'Role',
        type: EnumType.ADMIN,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'customer',
        display_name: 'Customer',
        type: EnumType.ALL,
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
    await this._helper.executingLog(this.SEEDER_NAME, seederLogRepository);
  }
}
