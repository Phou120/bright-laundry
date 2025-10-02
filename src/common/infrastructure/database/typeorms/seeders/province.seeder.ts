import { Inject, Injectable } from '@nestjs/common';
import { HelperSeeder } from './helper.seeder';
import { EntityManager } from 'typeorm';
import { SeederLogOrmEntity } from '../entities/seeder-log.orm';
import { ProvinceOrmEntity } from '../entities/province.orm';
import moment from 'moment';
import { Timezone } from '@src/common/value-objects/timezone.vo';
import { DateFormat } from '@src/common/value-objects/format-date.vo';

@Injectable()
export class ProvinceSeeder {
  private readonly SEEDER_NAME = 'province_seeder';

  constructor(@Inject() private readonly _helper: HelperSeeder) {}

  async seed(manager: EntityManager) {
    const seederLogRepo = manager.getRepository(SeederLogOrmEntity);
    const done = await this._helper.existingLog(
      this.SEEDER_NAME,
      seederLogRepo,
    );
    if (done) return;

    const _respository = manager.getRepository(ProvinceOrmEntity);
    const currentDateTime = moment
      .tz(Timezone.LAOS)
      .format(DateFormat.DATETIME_FORMAT);

    const items = [
      {
        name: 'ຜົ້ງສາລີ',
        prefix: 'PSL',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ຫລວງນ້ຳທາ',
        prefix: 'LNA',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ອຸດົມໄຊ',
        prefix: 'ODI',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ບໍ່ແກ້ວ',
        prefix: 'BKO',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ຫຼວງພະບາງ',
        prefix: 'LPG',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ຫົວພັນ',
        prefix: 'HPN',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ໄຊຍະບູລີ',
        prefix: 'XGI',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ຊຽງຂວາງ',
        prefix: 'XKG',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ວຽງຈັນ',
        prefix: 'VT',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ນະຄອນຫລວງວຽງຈັນ',
        prefix: 'VTE',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ໄຊສົມບູນ',
        prefix: 'SXN',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ບໍລິຄຳໄຊ',
        prefix: 'PXE',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ຄຳມ່ວນ',
        prefix: 'KMN',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ສະຫວັນນະເຂດ',
        prefix: 'SVT',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ສາລະວັນ',
        prefix: 'SLN',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ເຊກອງ',
        prefix: 'XGG',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ຈຳປາສັກ',
        prefix: 'PSE',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ອັດຕະປື',
        prefix: 'ATU',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ຫນອງຄາຍ',
        prefix: 'TH_NK',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
    ];

    for (const item of items) {
      // const existingItem = await _respository.findOne({
      //   where: { name: item.name },
      // });
      // if (!existingItem) {
      //   const items = _respository.create(item);
      //   await _respository.save(items);
      // }
    }
    await this._helper.executingLog(this.SEEDER_NAME, seederLogRepo);
  }
}
