import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateSchema1757350602272 implements MigrationInterface {
    name = 'UpdateSchema1757350602272'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "tel" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "users" ADD "access_token" character varying(255)`);
        await queryRunner.query(`CREATE INDEX "IDX_a383ac5d1cc34720ea56a937a1" ON "users" ("tel") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_a383ac5d1cc34720ea56a937a1"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "access_token"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "tel"`);
    }

}
