import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateSchema1758214445826 implements MigrationInterface {
    name = 'UpdateSchema1758214445826'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "suppliers" ("id" SERIAL NOT NULL, "name" character varying(255), "email" character varying(255), "company" character varying(255), "phone_number" character varying(255), "address" text, "created_by" integer, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_b70ac51766a9e3144f778cfe81e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_5b5720d9645cee7396595a16c9" ON "suppliers" ("name") `);
        await queryRunner.query(`CREATE INDEX "IDX_66181e465a65c2ddcfa9c00c9c" ON "suppliers" ("email") `);
        await queryRunner.query(`CREATE INDEX "IDX_3355b063e039ed81307201425c" ON "suppliers" ("company") `);
        await queryRunner.query(`CREATE INDEX "IDX_a290dcf6cde0812fe9b465c71a" ON "suppliers" ("phone_number") `);
        await queryRunner.query(`CREATE INDEX "IDX_4be40fae84ce82ed3baef4a49f" ON "suppliers" ("created_by") `);
        await queryRunner.query(`CREATE TABLE "product_brands" ("id" SERIAL NOT NULL, "name" character varying(255), "image" character varying(255), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_f2b98a8f25bd37b19c8356ec659" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_aea8d677eeb858376cd69c87fa" ON "product_brands" ("name") `);
        await queryRunner.query(`CREATE TABLE "tags" ("id" SERIAL NOT NULL, "name" character varying(255), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_e7dc17249a1148a1970748eda99" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_d90243459a697eadb8ad56e909" ON "tags" ("name") `);
        await queryRunner.query(`CREATE TABLE "user_order_statuses" ("id" SERIAL NOT NULL, "name" character varying(255), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_b439bd7eb427e47611dc18b41d5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_8949c97c5af78b3b19bca271ef" ON "user_order_statuses" ("name") `);
        await queryRunner.query(`ALTER TABLE "suppliers" ADD CONSTRAINT "FK_4be40fae84ce82ed3baef4a49fa" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "suppliers" DROP CONSTRAINT "FK_4be40fae84ce82ed3baef4a49fa"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8949c97c5af78b3b19bca271ef"`);
        await queryRunner.query(`DROP TABLE "user_order_statuses"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d90243459a697eadb8ad56e909"`);
        await queryRunner.query(`DROP TABLE "tags"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_aea8d677eeb858376cd69c87fa"`);
        await queryRunner.query(`DROP TABLE "product_brands"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4be40fae84ce82ed3baef4a49f"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a290dcf6cde0812fe9b465c71a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3355b063e039ed81307201425c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_66181e465a65c2ddcfa9c00c9c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5b5720d9645cee7396595a16c9"`);
        await queryRunner.query(`DROP TABLE "suppliers"`);
    }

}
