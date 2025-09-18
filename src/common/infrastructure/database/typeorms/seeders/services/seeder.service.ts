import { Inject, Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { TRANSACTION_MANAGER_SERVICE } from '@src/common/constants/inject-key';
import { ITransactionManagerService } from '@src/common/infrastructure/transaction/transaction.interface';
import { DataSource } from 'typeorm';
import { UsersSeeder } from '../user.seed';
import { RoleSeeder } from '../role.seed';
import { PermissionGroupSeeder } from '../permission-group.seeder';
import { PermissionSeeder } from '../permission.seeder';
import { ProvinceSeeder } from '../province.seeder';
import { DistrictSeeder } from '../district.seeder';

@Injectable()
export class SeederService {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    @Inject(TRANSACTION_MANAGER_SERVICE)
    private readonly transactionManagerService: ITransactionManagerService,
    @Inject() private _roleSeeder: RoleSeeder,
    @Inject() private _userSeeder: UsersSeeder,
    @Inject() private _permissionGroupSeeder: PermissionGroupSeeder,
    @Inject() private _permissionSeeder: PermissionSeeder,
    @Inject() private _provinceSeeder: ProvinceSeeder,
    @Inject() private _districtSeeder: DistrictSeeder,
  ) {}

  async seed() {
    try {
      await this.transactionManagerService.runInTransaction(
        this.dataSource,
        async (manager) => {
          await this._roleSeeder.seed(manager);
          await this._userSeeder.seed(manager);
          await this._permissionGroupSeeder.seed(manager);
          await this._permissionSeeder.seed(manager);
          await this._provinceSeeder.seed(manager);
          await this._districtSeeder.seed(manager);
        },
      );
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
