import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePaymentWebhooksTable1738350626691 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS payment_webhooks (
          id SERIAL PRIMARY KEY,
          company_id INT NOT NULL,
          status VARCHAR(30) NOT NULL,
          received_data jsonb NOT NULL,
          created_at timestamp with time zone NOT NULL DEFAULT now(),
        updated_at timestamp with time zone NOT NULL DEFAULT now(),
          FOREIGN KEY (company_id) REFERENCES checkouts(id) ON DELETE CASCADE
        );
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`DROP TABLE IF EXISTS payment_webhooks;`);
  }
}
