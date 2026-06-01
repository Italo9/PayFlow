import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCartsTable1738350574110 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS carts (
          id SERIAL PRIMARY KEY,
          session_id VARCHAR(255) NOT NULL,
          company_id INT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
        );
      `);
      await queryRunner.query(`CREATE INDEX idx_carts_session ON carts(session_id);`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`DROP INDEX IF EXISTS idx_carts_session;`);
      await queryRunner.query(`DROP TABLE IF EXISTS carts;`);
  }
}
