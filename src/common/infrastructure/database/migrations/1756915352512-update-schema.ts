import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateSchema1756915352512 implements MigrationInterface {
  name = 'UpdateSchema1756915352512';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "roles" ("id" SERIAL NOT NULL, "name" character varying(255), "display_name" character varying(255), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_648e3f5447f725579d7d4ffdfb" ON "roles" ("name") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_498e566f23124e519c0d40609b" ON "roles" ("display_name") `,
    );
    await queryRunner.query(
      `CREATE TABLE "role_users" ("user_id" integer NOT NULL, "role_id" integer NOT NULL, CONSTRAINT "PK_e976807ebe4fc773c2365d91566" PRIMARY KEY ("user_id", "role_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1dc3ce23874f906d8306186671" ON "role_users" ("user_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_790a8ca58c37fd1f31944ae65e" ON "role_users" ("role_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "role_users" ADD CONSTRAINT "FK_1dc3ce23874f906d8306186671a" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_users" ADD CONSTRAINT "FK_790a8ca58c37fd1f31944ae65e2" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "role_users" DROP CONSTRAINT "FK_790a8ca58c37fd1f31944ae65e2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_users" DROP CONSTRAINT "FK_1dc3ce23874f906d8306186671a"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_790a8ca58c37fd1f31944ae65e"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_1dc3ce23874f906d8306186671"`,
    );
    await queryRunner.query(`DROP TABLE "role_users"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_498e566f23124e519c0d40609b"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_648e3f5447f725579d7d4ffdfb"`,
    );
    await queryRunner.query(`DROP TABLE "roles"`);
  }
}
