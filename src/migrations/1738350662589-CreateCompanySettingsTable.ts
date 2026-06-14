import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCompanySettingsTable1738350662589 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
          CREATE TABLE IF NOT EXISTS public.company_settings (
             id SERIAL PRIMARY KEY,
             limit_products_checkout INTEGER, -- Ajustado para number
             carpayment boolean,
             "companyId" bigint NOT NULL,
              gateway jsonb,
             created_at timestamp with time zone DEFAULT now() NOT NULL,
             updated_at timestamp with time zone DEFAULT now() NOT NULL
          );
        `);

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
        await queryRunner.query(`
          ALTER TABLE public.company_settings
          DROP CONSTRAINT IF EXISTS fk_company;
        `);

        await queryRunner.query(`DROP TABLE IF EXISTS public.company_settings;`);
    }
}
