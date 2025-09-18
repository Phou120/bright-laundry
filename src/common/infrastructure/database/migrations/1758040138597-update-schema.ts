import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateSchema1758040138597 implements MigrationInterface {
    name = 'UpdateSchema1758040138597'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "banners" ("id" SERIAL NOT NULL, "file_banner" character varying(255), "link" character varying(255), "order_by" character varying(255), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_e9b186b959296fcb940790d31c3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "provinces" ("id" SERIAL NOT NULL, "name" character varying(255), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_2e4260eedbcad036ec53222e0c7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_5c78199072262966fb68b71809" ON "provinces" ("name") `);
        await queryRunner.query(`CREATE TABLE "villages" ("id" SERIAL NOT NULL, "name" character varying(255), "user_id" integer, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_3d9cf7c71c05c7ef684331317bd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_f573f1f451d01eae4a6e7fce1b" ON "villages" ("name") `);
        await queryRunner.query(`CREATE INDEX "IDX_b0710d5275a1655698cdb28c95" ON "villages" ("user_id") `);
        await queryRunner.query(`CREATE TABLE "districts" ("id" SERIAL NOT NULL, "name" character varying(255), "user_id" integer, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_972a72ff4e3bea5c7f43a2b98af" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_6a6fd6d258022e5576afbad90b" ON "districts" ("name") `);
        await queryRunner.query(`CREATE INDEX "IDX_fcdfbbbdfd3780b61885260a2d" ON "districts" ("user_id") `);
        await queryRunner.query(`CREATE TYPE "public"."payment_methods_status_enum" AS ENUM('enable', 'disable')`);
        await queryRunner.query(`CREATE TABLE "payment_methods" ("id" SERIAL NOT NULL, "method" character varying(255), "icon" character varying(255), "status" "public"."payment_methods_status_enum", "sort_order" integer, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_34f9b8c6dfb4ac3559f7e2820d1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_02d578d93253ca308ec3110982" ON "payment_methods" ("method") `);
        await queryRunner.query(`CREATE INDEX "IDX_ff2f9fb98443523703d442cf35" ON "payment_methods" ("icon") `);
        await queryRunner.query(`CREATE INDEX "IDX_0af7a6c31e766d18c8efe185fc" ON "payment_methods" ("status") `);
        await queryRunner.query(`CREATE TABLE "user_profiles" ("id" SERIAL NOT NULL, "user_id" integer, "image" character varying(255), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "REL_6ca9503d77ae39b4b5a6cc3ba8" UNIQUE ("user_id"), CONSTRAINT "PK_1ec6662219f4605723f1e41b6cb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_6ca9503d77ae39b4b5a6cc3ba8" ON "user_profiles" ("user_id") `);
        await queryRunner.query(`CREATE TYPE "public"."receiver_addresses_type_enum" AS ENUM('home', 'office', 'other')`);
        await queryRunner.query(`CREATE TABLE "receiver_addresses" ("id" SERIAL NOT NULL, "name" character varying(255), "tel" character varying(255), "is_current" boolean NOT NULL DEFAULT false, "type" "public"."receiver_addresses_type_enum", "user_id" integer, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "REL_e0e1d26173913ef4c04a7f50f4" UNIQUE ("user_id"), CONSTRAINT "PK_e6a8a68d25dbd53c84847d20176" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_7681fdcfd0ffa5c68302def692" ON "receiver_addresses" ("name") `);
        await queryRunner.query(`CREATE INDEX "IDX_144a5870380a4c3ef983e223f4" ON "receiver_addresses" ("tel") `);
        await queryRunner.query(`CREATE INDEX "IDX_ffb941c8ba87c4c0008d11e7a0" ON "receiver_addresses" ("type") `);
        await queryRunner.query(`CREATE INDEX "IDX_e0e1d26173913ef4c04a7f50f4" ON "receiver_addresses" ("user_id") `);
        await queryRunner.query(`ALTER TABLE "users" ADD "user_no" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "users" ADD "notification_token" character varying(255)`);
        await queryRunner.query(`CREATE INDEX "IDX_e5f6813966537a78538a896d74" ON "users" ("user_no") `);
        await queryRunner.query(`ALTER TABLE "villages" ADD CONSTRAINT "FK_b0710d5275a1655698cdb28c951" FOREIGN KEY ("user_id") REFERENCES "districts"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "districts" ADD CONSTRAINT "FK_fcdfbbbdfd3780b61885260a2d0" FOREIGN KEY ("user_id") REFERENCES "provinces"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_profiles" ADD CONSTRAINT "FK_6ca9503d77ae39b4b5a6cc3ba88" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "receiver_addresses" ADD CONSTRAINT "FK_e0e1d26173913ef4c04a7f50f4b" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "receiver_addresses" DROP CONSTRAINT "FK_e0e1d26173913ef4c04a7f50f4b"`);
        await queryRunner.query(`ALTER TABLE "user_profiles" DROP CONSTRAINT "FK_6ca9503d77ae39b4b5a6cc3ba88"`);
        await queryRunner.query(`ALTER TABLE "districts" DROP CONSTRAINT "FK_fcdfbbbdfd3780b61885260a2d0"`);
        await queryRunner.query(`ALTER TABLE "villages" DROP CONSTRAINT "FK_b0710d5275a1655698cdb28c951"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e5f6813966537a78538a896d74"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "notification_token"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "user_no"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e0e1d26173913ef4c04a7f50f4"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ffb941c8ba87c4c0008d11e7a0"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_144a5870380a4c3ef983e223f4"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7681fdcfd0ffa5c68302def692"`);
        await queryRunner.query(`DROP TABLE "receiver_addresses"`);
        await queryRunner.query(`DROP TYPE "public"."receiver_addresses_type_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6ca9503d77ae39b4b5a6cc3ba8"`);
        await queryRunner.query(`DROP TABLE "user_profiles"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0af7a6c31e766d18c8efe185fc"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ff2f9fb98443523703d442cf35"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_02d578d93253ca308ec3110982"`);
        await queryRunner.query(`DROP TABLE "payment_methods"`);
        await queryRunner.query(`DROP TYPE "public"."payment_methods_status_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_fcdfbbbdfd3780b61885260a2d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6a6fd6d258022e5576afbad90b"`);
        await queryRunner.query(`DROP TABLE "districts"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b0710d5275a1655698cdb28c95"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f573f1f451d01eae4a6e7fce1b"`);
        await queryRunner.query(`DROP TABLE "villages"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5c78199072262966fb68b71809"`);
        await queryRunner.query(`DROP TABLE "provinces"`);
        await queryRunner.query(`DROP TABLE "banners"`);
    }

}
