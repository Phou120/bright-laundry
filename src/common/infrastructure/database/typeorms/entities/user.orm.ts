import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';
import { RoleOrmEntity } from './role.orm';
import { UserHasPermissionOrmEntity } from './user-has-permission.orm';
import { UserProfileOrmEntity } from './user-profile.orm';
import { StoreUserOrmEntity } from './store-user.orm';
import { WashingMachineOrmEntity } from './washing-machine.orm';

@Entity('users')
export class UserOrmEntity {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Index()
  @Column({ type: 'varchar', length: 255, nullable: true })
  user_no?: string;

  @Index()
  @Column({ type: 'varchar', length: 255, nullable: true })
  name?: string;

  @Index()
  @Column({ type: 'varchar', length: 255, nullable: true })
  surname?: string;

  @Index()
  @Column({ type: 'varchar', length: 255, nullable: true })
  tel?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  password?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  access_token?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  verify_otp?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  notification_token?: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at: Date | null;

  @ManyToMany(() => RoleOrmEntity, (role: RoleOrmEntity) => role.users, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  @JoinTable({
    name: 'role_users',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'role_id',
      referencedColumnName: 'id',
    },
  })
  roles: Relation<RoleOrmEntity[]>;

  @OneToMany(
    () => UserHasPermissionOrmEntity,
    (userHasPermission) => userHasPermission.user,
  )
  userHasPermissions: Relation<UserHasPermissionOrmEntity[]>;

  @OneToOne(() => UserProfileOrmEntity, (user_profile) => user_profile.user)
  user_profile: Relation<UserProfileOrmEntity>;

  @OneToMany(() => StoreUserOrmEntity, (storeUser) => storeUser.user)
  store_users: Relation<StoreUserOrmEntity[]>;

  @OneToMany(
    () => WashingMachineOrmEntity,
    (washingMachine) => washingMachine.user,
  )
  washing_machines: Relation<WashingMachineOrmEntity[]>;
}
