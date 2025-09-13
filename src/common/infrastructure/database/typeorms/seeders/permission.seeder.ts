import { DateFormat } from '@src/common/value-objects/format-date.vo';
import moment from 'moment-timezone';
import { PermissionOrmEntity } from '../entities/permission.orm';
import { SeederLogOrmEntity } from '../entities/seeder-log.orm';
import { EntityManager } from 'typeorm';
import { HelperSeeder } from './helper.seeder';
import { Inject, Injectable } from '@nestjs/common';
import { Timezone } from '@src/common/value-objects/timezone.vo';

@Injectable()
export class PermissionSeeder {
  private readonly SEEDER_NAME = 'permission_seeders';

  constructor(@Inject() private readonly _helper: HelperSeeder) {}

  async seed(manager: EntityManager) {
    const seederLogRepository = manager.getRepository(SeederLogOrmEntity);
    const isExecute = await this._helper.existingLog(
      this.SEEDER_NAME,
      seederLogRepository,
    );
    if (isExecute) return [];

    const _repository = manager.getRepository(PermissionOrmEntity);
    const currentDateTime = moment
      .tz(Timezone.LAOS)
      .format(DateFormat.DATETIME_FORMAT);

    // Define your mapping here
    const permissionGroupMapping: Record<string, number> = {
      'create-user': 1,
      'read-user': 1,
      'update-user': 1,
      'delete-user': 1,

      'create-role': 2,
      'read-role': 2,
      'update-role': 2,
      'delete-role': 2,

      'create-customer': 3,
      'read-customer': 3,
      'update-customer': 3,
      'delete-customer': 3,
    };

    const items = Object.entries(permissionGroupMapping).map(
      ([name, groupId]) => ({
        name,
        guard_name: 'api',
        permission_group_id: groupId,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      }),
    );

    for (const item of items) {
      const existingItem = await _repository.findOne({
        where: { name: item.name },
      });
      if (!existingItem) {
        const createdItem = _repository.create(item);
        await _repository.save(createdItem);
      }
    }

    await this._helper.executingLog(this.SEEDER_NAME, seederLogRepository);
  }
}
