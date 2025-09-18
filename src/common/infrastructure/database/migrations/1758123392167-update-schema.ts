import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateSchema1758123392167 implements MigrationInterface {
    name = 'UpdateSchema1758123392167'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "districts" DROP CONSTRAINT "FK_fcdfbbbdfd3780b61885260a2d0"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_fcdfbbbdfd3780b61885260a2d"`);
        await queryRunner.query(`ALTER TABLE "districts" RENAME COLUMN "user_id" TO "province_id"`);
        await queryRunner.query(`CREATE INDEX "IDX_9d451638507b11822dc411a2df" ON "districts" ("province_id") `);
        await queryRunner.query(`ALTER TABLE "districts" ADD CONSTRAINT "FK_9d451638507b11822dc411a2dfe" FOREIGN KEY ("province_id") REFERENCES "provinces"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "districts" DROP CONSTRAINT "FK_9d451638507b11822dc411a2dfe"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9d451638507b11822dc411a2df"`);
        await queryRunner.query(`ALTER TABLE "districts" RENAME COLUMN "province_id" TO "user_id"`);
        await queryRunner.query(`CREATE INDEX "IDX_fcdfbbbdfd3780b61885260a2d" ON "districts" ("user_id") `);
        await queryRunner.query(`ALTER TABLE "districts" ADD CONSTRAINT "FK_fcdfbbbdfd3780b61885260a2d0" FOREIGN KEY ("user_id") REFERENCES "provinces"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

}
