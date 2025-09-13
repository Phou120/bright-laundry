import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateSchema1756911221703 implements MigrationInterface {
  name = 'UpdateSchema1756911221703';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "seeder_logs" ("id" BIGSERIAL NOT NULL, "name" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f4c857013b491a17a489ce07c95" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_10a312edcfeaec6a6f0713e739" ON "seeder_logs" ("name") `,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" SERIAL NOT NULL, "name" character varying(255), "surname" character varying(255), "email" character varying(255), "password" character varying(255), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_51b8b26ac168fbe7d6f5653e6c" ON "users" ("name") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_5d6bb8b8d415f4808a784b4aa9" ON "users" ("surname") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_5d6bb8b8d415f4808a784b4aa9"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_51b8b26ac168fbe7d6f5653e6c"`,
    );
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_10a312edcfeaec6a6f0713e739"`,
    );
    await queryRunner.query(`DROP TABLE "seeder_logs"`);
  }
}
