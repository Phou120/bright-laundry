import { Inject, Injectable } from '@nestjs/common';
import { HelperSeeder } from './helper.seeder';
import { EntityManager } from 'typeorm';
import { SeederLogOrmEntity } from '../entities/seeder-log.orm';
import { DistrictOrmEntity } from '../entities/district.orm';
import moment from 'moment';
import { Timezone } from '@src/common/value-objects/timezone.vo';
import { DateFormat } from '@src/common/value-objects/format-date.vo';

@Injectable()
export class DistrictSeeder {
  private readonly SEEDER_NAME = 'district_seeder';

  constructor(@Inject() private readonly _helper: HelperSeeder) {}

  async seed(manager: EntityManager) {
    const seederLogRepo = manager.getRepository(SeederLogOrmEntity);
    const done = await this._helper.existingLog(
      this.SEEDER_NAME,
      seederLogRepo,
    );
    if (done) return;

    const _respository = manager.getRepository(DistrictOrmEntity);
    const currentDateTime = moment
      .tz(Timezone.LAOS)
      .format(DateFormat.DATETIME_FORMAT);

    const items = [
      {
        name: 'ຜົ້ງສາລີ',
        province_id: 1,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ໃຫມ່',
        province_id: 1,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ຂວາ',
        province_id: 1,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ສຳພັນ',
        province_id: 1,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ບູນເຫນືອ',
        province_id: 1,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ຍອດອູ',
        province_id: 1,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ບູນໃຕ້',
        province_id: 1,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ຫລວງນ້ຳທາ',
        province_id: 2,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ສິງ',
        province_id: 2,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ລອງ',
        province_id: 2,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ວຽງພູຄາ',
        province_id: 2,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ນາແລ',
        province_id: 2,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ນໍ້າທາ',
        province_id: 2,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ໄຊ',
        province_id: 3,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ຫລາ',
        province_id: 3,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ນາໝໍ້',
        province_id: 3,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ງາ',
        province_id: 3,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ແບງ',
        province_id: 3,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ຮຸນ',
        province_id: 3,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ປາກແບງ',
        province_id: 3,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ຫ້ວຍຊາຍ',
        province_id: 4,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ຕົ້ນເຜິ້ງ',
        province_id: 4,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ເມິງ',
        province_id: 4,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ຜາອຸດົມ',
        province_id: 4,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ປາກທາ',
        province_id: 4,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ຫຼວງພະບາງ',
        province_id: 5,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ຊຽງເງິນ',
        province_id: 5,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ນານ',
        province_id: 5,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ປາກອູ',
        province_id: 5,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ນ້ຳບາກ',
        province_id: 5,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ງອຍ',
        province_id: 5,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ປາກແຊງ',
        province_id: 5,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ໂພນໄຊ',
        province_id: 5,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ຈອມເພັດ',
        province_id: 5,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ວຽງຄຳ',
        province_id: 5,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ພູຄູນ',
        province_id: 5,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ໂພນທອງ',
        province_id: 5,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ຊຳເໜືອ',
        province_id: 6,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ຊຽງຄໍ້',
        province_id: 6,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ຮ້ຽມ',
        province_id: 6,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ວຽງໄຊ',
        province_id: 6,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ຫົວເມືອງ',
        province_id: 6,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ຊຳໃຕ້',
        province_id: 6,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ສົບເບົາ',
        province_id: 6,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ແອດ',
        province_id: 6,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ກວັນ',
        province_id: 6,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ຊອນ',
        province_id: 6,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ໄຊຍະບູລີ',
        province_id: 7,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ຄອບ',
        province_id: 7,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ຫົງສາ',
        province_id: 7,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ເງິນ',
        province_id: 7,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ຊຽງຮ່ອນ',
        province_id: 7,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ພຽງ',
        province_id: 7,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ປາກລາຍ',
        province_id: 7,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ແກ່ນທ້າວ',
        province_id: 7,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ບໍ່ແຕນ',
        province_id: 7,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ທົ່ງມີໄຊ',
        province_id: 7,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ໄຊຊະຖານ',
        province_id: 7,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ແປກ',
        province_id: 8,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ຄຳ',
        province_id: 8,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ໜອງແຮດ',
        province_id: 8,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ຄູນ',
        province_id: 8,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ໝອກ',
        province_id: 8,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ພູກູດ',
        province_id: 8,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ຜາໄຊ',
        province_id: 8,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ແປກ',
        province_id: 8,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ຄຳ',
        province_id: 8,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ພູກູດ',
        province_id: 8,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ຄູນ',
        province_id: 8,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ໝອກ',
        province_id: 8,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ຜາໄຊ',
        province_id: 8,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ໂພນໂຮງ',
        province_id: 9,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ທຸລະຄົມ',
        province_id: 9,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ແກ້ວອຸດົມ',
        province_id: 9,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ກາສີ',
        province_id: 9,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ວັງວຽງ',
        province_id: 9,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ເຟືອງ',
        province_id: 9,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ຊະນະຄາມ',
        province_id: 9,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ແມດ',
        province_id: 9,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ວຽງຄຳ',
        province_id: 9,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ຫີນເຫີບ',
        province_id: 9,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ໝື່ນ',
        province_id: 9,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ຈັນທະບູລີ',
        province_id: 10,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ສີໂຄດຕະບອງ',
        province_id: 10,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ໄຊເສດຖາ',
        province_id: 10,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ສີສັດຕະນາກ',
        province_id: 10,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ນາຊາຍທອງ',
        province_id: 10,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ໄຊທານີ',
        province_id: 10,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ຫາດຊາຍຟອງ',
        province_id: 10,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ສັງທອງ',
        province_id: 10,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ປາກງື່ມ',
        province_id: 10,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ອານຸວົງ',
        province_id: 11,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ທ່າໂທມ',
        province_id: 11,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ລ້ອງແຈ້ງ',
        province_id: 11,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ຮົ່ມ',
        province_id: 11,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ລ້ອງຊານ',
        province_id: 11,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ປາກຊັນ',
        province_id: 12,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ທ່າພະບາດ',
        province_id: 12,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ປາກກະດິງ',
        province_id: 12,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ບໍລິຄັນ',
        province_id: 12,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ຄຳເກີດ',
        province_id: 12,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ວຽງທອງ',
        province_id: 12,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ໄຊຈຳພອນ',
        province_id: 12,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ທ່າແຂກ',
        province_id: 13,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ມະຫາໄຊ',
        province_id: 13,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ໜອງບົກ',
        province_id: 13,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ຫີນບູນ',
        province_id: 13,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ຍົມມະລາດ',
        province_id: 13,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ບົວລະພາ',
        province_id: 13,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ນາກາຍ',
        province_id: 13,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ເຊບັ້ງໄຟ',
        province_id: 13,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ໄຊບົວທອງ',
        province_id: 13,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ຄູນຄຳ',
        province_id: 13,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ນະຄອນໄກສອນ',
        province_id: 14,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ອຸທຸມພອນ',
        province_id: 14,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ອາດສະພັງທອງ',
        province_id: 14,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ພີນ',
        province_id: 14,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ເຊໂປນ',
        province_id: 14,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ນອງ',
        province_id: 14,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ທ່າປາງທອງ',
        province_id: 14,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ສອງຄອນ',
        province_id: 14,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ຈຳພອນ',
        province_id: 14,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ຊົນບູລີ',
        province_id: 14,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ໄຊບູລີ',
        province_id: 14,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ວິລະບູລີ',
        province_id: 14,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ອາດສະພອນ',
        province_id: 14,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ໄຊພູທອງ',
        province_id: 14,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ພະລານໄຊ',
        province_id: 14,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ຊົນນະບູລີ',
        province_id: 14,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ສາລະວັນ',
        province_id: 15,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ຕາໂອ້ຍ',
        province_id: 15,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ຕຸ້ມລານ',
        province_id: 15,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ລະຄອນເພັງ',
        province_id: 15,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ວາປີ',
        province_id: 15,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ຄົງເຊໂດນ',
        province_id: 15,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ເລົ່າງາມ',
        province_id: 15,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ສະມ້ວຍ',
        province_id: 15,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ລະມາມ',
        province_id: 16,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ກະລືມ',
        province_id: 16,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ດາກຈຶງ',
        province_id: 16,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ທ່າແຕງ',
        province_id: 16,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ນະຄອນປາກເຊ',
        province_id: 17,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ຊະນະສົມບູນ',
        province_id: 17,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ບາຈຽງຈະເລີນສຸກ',
        province_id: 17,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ປາກຊ່ອງ',
        province_id: 17,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ປະທຸມພອນ',
        province_id: 17,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ໂພນທອງ',
        province_id: 17,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ຈຳປາສັກ',
        province_id: 17,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ສຸຂຸມາ',
        province_id: 17,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ມຸນລະປະໂມກ',
        province_id: 17,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ໂຂງ',
        province_id: 17,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ໄຊເສດຖາ',
        province_id: 18,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ສາມະຄີໄຊ',
        province_id: 18,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ສະໜາມໄຊ',
        province_id: 18,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ສານໄຊ',
        province_id: 18,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ພູວົງ',
        province_id: 18,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ຫນອງຄາຍ',
        province_id: 19,
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
