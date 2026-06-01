import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCompanySettingsTable1738350662589 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
          CREATE TABLE IF NOT EXISTS public.company_settings (
            id bigint NOT NULL,
            "ValueHour" double precision NOT NULL,
            "ValueFractionHour" double precision NOT NULL,
            autoRecharge boolean NOT NULL,
            "timeTolerance" time without time zone NOT NULL,
            "companyId" bigint NOT NULL,
            created_at timestamp with time zone NOT NULL,
            updated_at timestamp with time zone NOT NULL,
            PRIMARY KEY (id)
          );
        `);

        // chave estrengeira para a tabela companies
        await queryRunner.query(`
          ALTER TABLE public.company_settings
          ADD CONSTRAINT fk_company
          FOREIGN KEY ("companyId")
            REFERENCES public.companies(id)
            ON DELETE CASCADE
            ON UPDATE CASCADE;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {

        // Drop chave estrangeira para a tabela companies
        await queryRunner.query(`
          ALTER TABLE public.company_settings
          DROP CONSTRAINT fk_company;
        `);

        await queryRunner.query(`DROP TABLE IF EXISTS public.company_settings;`);
    }

}
