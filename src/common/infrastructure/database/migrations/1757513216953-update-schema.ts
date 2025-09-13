import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateSchema1757513216953 implements MigrationInterface {
    name = 'UpdateSchema1757513216953'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_has_permissions" ("permission_id" integer NOT NULL, "user_id" integer NOT NULL, CONSTRAINT "PK_61dd80e55251e1bcc1818008e4e" PRIMARY KEY ("permission_id", "user_id"))`);
        await queryRunner.query(`CREATE INDEX "user_has_permissions_permission_id_index" ON "user_has_permissions" ("permission_id") `);
        await queryRunner.query(`CREATE INDEX "user_has_permissions_user_id_index" ON "user_has_permissions" ("user_id") `);
        await queryRunner.query(`CREATE TABLE "permissions" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "guard_name" character varying(255), "display_name" character varying(255), "permission_group_id" integer, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "UQ_48ce552495d14eae9b187bb6716" UNIQUE ("name"), CONSTRAINT "PK_920331560282b8bd21bb02290df" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_8f6f729862e4d1ab66c2f39cd0" ON "permissions" ("permission_group_id") `);
        await queryRunner.query(`CREATE TYPE "public"."permission_groups_type_enum" AS ENUM('all', 'admin', 'user')`);
        await queryRunner.query(`CREATE TABLE "permission_groups" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "display_name" character varying(255) NOT NULL, "type" "public"."permission_groups_type_enum" NOT NULL DEFAULT 'all', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "UQ_4d923def23302dc5da192374bfc" UNIQUE ("name"), CONSTRAINT "UQ_9670345ecc48edf28ab3feb9ec5" UNIQUE ("display_name"), CONSTRAINT "PK_e6d3b6dc86109f8149c4d6c5400" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_f0e29bbe8fb8ad843b550f7824" ON "permission_groups" ("type") `);
        await queryRunner.query(`ALTER TABLE "user_has_permissions" ADD CONSTRAINT "FK_6c3e7c9682a0bd4879c475e5df6" FOREIGN KEY ("permission_id") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_has_permissions" ADD CONSTRAINT "FK_338fbd9e726c66cd65176cb8512" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "permissions" ADD CONSTRAINT "FK_8f6f729862e4d1ab66c2f39cd08" FOREIGN KEY ("permission_group_id") REFERENCES "permission_groups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "permissions" DROP CONSTRAINT "FK_8f6f729862e4d1ab66c2f39cd08"`);
        await queryRunner.query(`ALTER TABLE "user_has_permissions" DROP CONSTRAINT "FK_338fbd9e726c66cd65176cb8512"`);
        await queryRunner.query(`ALTER TABLE "user_has_permissions" DROP CONSTRAINT "FK_6c3e7c9682a0bd4879c475e5df6"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f0e29bbe8fb8ad843b550f7824"`);
        await queryRunner.query(`DROP TABLE "permission_groups"`);
        await queryRunner.query(`DROP TYPE "public"."permission_groups_type_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8f6f729862e4d1ab66c2f39cd0"`);
        await queryRunner.query(`DROP TABLE "permissions"`);
        await queryRunner.query(`DROP INDEX "public"."user_has_permissions_user_id_index"`);
        await queryRunner.query(`DROP INDEX "public"."user_has_permissions_permission_id_index"`);
        await queryRunner.query(`DROP TABLE "user_has_permissions"`);
    }

}
