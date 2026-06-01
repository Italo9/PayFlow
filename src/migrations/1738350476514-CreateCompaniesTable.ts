import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCompaniesTable1738350476514 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
          CREATE TABLE IF NOT EXISTS public."companies" (
            id bigint NOT NULL,
            name character varying(255) NOT NULL,
            cnpj character varying(14) NOT NULL,
            active boolean NOT NULL,
            "peopleForContact" character varying(255),
            phone character varying,
            email character varying,
            created_at timestamp with time zone NOT NULL,
            updated_at timestamp with time zone NOT NULL,
            PRIMARY KEY (id)
          );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS public."companies";`);
    }

}
