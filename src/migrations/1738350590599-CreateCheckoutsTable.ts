import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCheckoutsTable1738350590599 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
          CREATE TABLE IF NOT EXISTS public."checkouts" (
            id bigint NOT NULL,
            url character varying NOT NULL,
            valor double precision,
            status character varying NOT NULL,
            "ticketId" bigint NOT NULL,
            created_at timestamp with time zone NOT NULL,
            updated_at timestamp with time zone NOT NULL,
            PRIMARY KEY (id)
          );
        `);

        // Chave estrangeira de ticketId
        await queryRunner.query(`
          ALTER TABLE public."checkouts"
          ADD CONSTRAINT "fk_ticketId_checkouts" FOREIGN KEY ("ticketId") 
          REFERENCES public."tickets"("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {

        // Drop chave estrangeira de ticketId
        await queryRunner.query(`
          ALTER TABLE public."checkouts"
          DROP CONSTRAINT "fk_ticketId_checkouts";
        `);

        await queryRunner.query(`DROP TABLE IF EXISTS public."checkouts"; `);
    }

}
