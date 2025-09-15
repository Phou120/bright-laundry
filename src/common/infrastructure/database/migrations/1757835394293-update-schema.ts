import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateSchema1757835394293 implements MigrationInterface {
    name = 'UpdateSchema1757835394293'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "verify_top" TO "verify_otp"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "verify_otp" TO "verify_top"`);
    }

}
