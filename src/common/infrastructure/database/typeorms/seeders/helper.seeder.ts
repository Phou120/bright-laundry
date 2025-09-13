import { Injectable } from '@nestjs/common';
import moment from 'moment-timezone';
import { Repository } from 'typeorm';
import { SeederLogOrmEntity } from '../entities/seeder-log.orm';
import { DateFormat } from 'src/common/value-objects/format-date.vo';
import { Timezone } from '@src/common/value-objects/timezone.vo';

@Injectable()
export class HelperSeeder {
  async existingLog(
    seederName: string,
    repository: Repository<SeederLogOrmEntity>,
  ) {
    const existingLog = await repository.findOne({
      where: { name: seederName },
    });
    if (existingLog) {
      console.log(`${seederName} already executed. skipping...`);
      return true;
    }
    return false;
  }

  async executingLog(
    seederName: string,
    repository: Repository<SeederLogOrmEntity>,
  ) {
    try {
      const seederLog = repository.create({
        name: seederName,
        created_at: moment.tz(Timezone.LAOS).format(DateFormat.DATETIME_FORMAT),
      });
      await repository.save(seederLog);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
