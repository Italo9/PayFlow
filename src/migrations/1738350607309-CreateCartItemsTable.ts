import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCartItemsTable1738350607309 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS cart_items (
          id SERIAL PRIMARY KEY,
          cart_id INT NOT NULL,
          product_id INT NOT NULL,
          quantity INT NOT NULL DEFAULT 1,
          FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE CASCADE,
          FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
        );
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`DROP TABLE IF EXISTS cart_items;`);
  }
}
