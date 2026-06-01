import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePaymentWebhooksTable1738350626691 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS payment_webhooks (
          id SERIAL PRIMARY KEY,
          order_id INT NOT NULL,
          status VARCHAR(10) CHECK (status IN ('success', 'failure')) NOT NULL,
          received_data TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (order_id) REFERENCES checkouts(id) ON DELETE CASCADE
        );
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`DROP TABLE IF EXISTS payment_webhooks;`);
  }
}
