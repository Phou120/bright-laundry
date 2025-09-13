import { Inject, Injectable } from '@nestjs/common';
import { HelperSeeder } from './helper.seeder';
import { EntityManager } from 'typeorm';
import { SeederLogOrmEntity } from '../entities/seeder-log.orm';
import { UserOrmEntity } from '../entities/user.orm';
import { RoleOrmEntity } from '../entities/role.orm';
import moment from 'moment-timezone';
import { Timezone } from '@src/common/value-objects/timezone.vo';
import { DateFormat } from '@src/common/value-objects/format-date.vo';
import { hashPassword } from '@src/common/utils/hash-password';

@Injectable()
export class UsersSeeder {
  private readonly SEEDER_NAME = 'user_seeder';

  constructor(@Inject() private readonly _helper: HelperSeeder) {}

  async seed(manager: EntityManager) {
    const seederLogRepo = manager.getRepository(SeederLogOrmEntity);
    const done = await this._helper.existingLog(
      this.SEEDER_NAME,
      seederLogRepo,
    );
    if (done) return;

    const userRepo = manager.getRepository(UserOrmEntity);
    const roleRepo = manager.getRepository(RoleOrmEntity);
    const currentDateTime = moment
      .tz(Timezone.LAOS)
      .format(DateFormat.DATETIME_FORMAT);

    // Fetch all roles from the database
    const roles = await roleRepo.find();

    // Seed users WITH roles
    const usersData = [
      {
        name: 'super admin',
        surname: 'super admin',
        email: 'super_admin@gmail.com',
        password: await hashPassword('super@2025-e'),
        created_at: currentDateTime,
        updated_at: currentDateTime,
        roles: roles.filter((r) => r.name === 'super-admin'),
      },
      {
        name: 'admin',
        surname: 'admin',
        email: 'admin@gmail.com',
        password: await hashPassword('admin@2025-e'),
        created_at: currentDateTime,
        updated_at: currentDateTime,
        roles: roles.filter((r) => r.name === 'admin'),
      },
      {
        name: 'user',
        surname: 'user',
        email: 'user@gmail.com',
        password: await hashPassword('user@2025-e'),
        created_at: currentDateTime,
        updated_at: currentDateTime,
        roles: roles.filter((r) => r.name === 'user'),
      },
    ];

    for (const userData of usersData) {
      const existingUser = await userRepo.findOne({
        where: { email: userData.email },
        relations: ['roles'],
      });
      if (!existingUser) {
        const user = userRepo.create(userData);
        await userRepo.save(user);
      }
    }

    await this._helper.executingLog(this.SEEDER_NAME, seederLogRepo);
  }
}
