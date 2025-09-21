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

  private toDisplayName(name: string): string {
    // Converts "create-customer" or "create_customer" to "Create Customer"
    return name
      .replace(/[-_]+/g, ' ')
      .trim()
      .replace(/\s+/g, ' ')
      .replace(/\b\w/g, (m) => m.toUpperCase());
  }

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

      'create-banner': 4,
      'read-banner': 4,
      'update-banner': 4,
      'delete-banner': 4,

      'create-brand': 5,
      'read-brand': 5,
      'update-brand': 5,
      'delete-brand': 5,
    };

    const items = Object.entries(permissionGroupMapping).map(
      ([name, groupId]) => ({
        name,
        display_name: this.toDisplayName(name),
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
        continue;
      }

      // Backfill/ensure display_name if missing or out-of-sync
      const computedDisplayName = this.toDisplayName(existingItem.name);
      if (
        !existingItem.display_name ||
        existingItem.display_name !== computedDisplayName
      ) {
        existingItem.display_name = computedDisplayName;
        existingItem.updated_at = currentDateTime as unknown as Date;
        await _repository.save(existingItem);
      }
    }

    await this._helper.executingLog(this.SEEDER_NAME, seederLogRepository);
  }
}
