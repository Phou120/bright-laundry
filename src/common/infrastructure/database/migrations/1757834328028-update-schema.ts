import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateSchema1757834328028 implements MigrationInterface {
    name = 'UpdateSchema1757834328028'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "verify_top" character varying(255)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "verify_top"`);
    }

}
