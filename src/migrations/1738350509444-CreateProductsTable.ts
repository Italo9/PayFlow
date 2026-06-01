import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateProductsTable1738350512345 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS products (
          id SERIAL PRIMARY KEY,
          company_id INT NOT NULL,
          name VARCHAR(255) NOT NULL,
          price NUMERIC(10,2) NOT NULL,
          qr_code TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
        );
      `);
      await queryRunner.query(`CREATE INDEX idx_products_company ON products(company_id);`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`DROP INDEX IF EXISTS idx_products_company;`);
      await queryRunner.query(`DROP TABLE IF EXISTS products;`);
  }
}
