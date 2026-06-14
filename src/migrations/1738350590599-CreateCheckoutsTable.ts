import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCheckoutsTable1738350590599 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          CREATE TABLE IF NOT EXISTS public."checkouts" (
            id SERIAL PRIMARY KEY,
            payment_status character varying,
            "total" numeric  NOT NULL,
            cart_id INT NOT NULL,
            "qrcode" character varying,
            "companyId" bigint NOT NULL,
            created_at timestamp with time zone NOT NULL DEFAULT now(),
            updated_at timestamp with time zone NOT NULL DEFAULT now()
          );
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS public."checkouts"; `);
  }
}
