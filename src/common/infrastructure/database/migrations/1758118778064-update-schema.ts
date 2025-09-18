import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateSchema1758118778064 implements MigrationInterface {
    name = 'UpdateSchema1758118778064'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "provinces" ADD "prefix" character varying(255)`);
        await queryRunner.query(`CREATE INDEX "IDX_37aa8ed7264fc99caa976d45b4" ON "provinces" ("prefix") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_37aa8ed7264fc99caa976d45b4"`);
        await queryRunner.query(`ALTER TABLE "provinces" DROP COLUMN "prefix"`);
    }

}
