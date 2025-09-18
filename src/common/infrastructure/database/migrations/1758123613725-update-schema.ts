import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateSchema1758123613725 implements MigrationInterface {
  name = 'UpdateSchema1758123613725';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "districts" ("id" SERIAL NOT NULL, "name" character varying(255), "province_id" integer, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_972a72ff4e3bea5c7f43a2b98af" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_6a6fd6d258022e5576afbad90b" ON "districts" ("name") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9d451638507b11822dc411a2df" ON "districts" ("province_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "villages" ADD CONSTRAINT "FK_b0710d5275a1655698cdb28c951" FOREIGN KEY ("user_id") REFERENCES "districts"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "districts" ADD CONSTRAINT "FK_9d451638507b11822dc411a2dfe" FOREIGN KEY ("province_id") REFERENCES "provinces"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "districts" DROP CONSTRAINT "FK_9d451638507b11822dc411a2dfe"`,
    );
    await queryRunner.query(
      `ALTER TABLE "villages" DROP CONSTRAINT "FK_b0710d5275a1655698cdb28c951"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_9d451638507b11822dc411a2df"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_6a6fd6d258022e5576afbad90b"`,
    );
    await queryRunner.query(`DROP TABLE "districts"`);
  }
}
