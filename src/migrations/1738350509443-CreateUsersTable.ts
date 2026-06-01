import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUsersTable1738350509443 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS public."users" (
              id bigint GENERATED ALWAYS AS IDENTITY,
              name character varying(255) NOT NULL,
              "lastName" character varying(255),
              email character varying(255) NOT NULL,
              password character varying(255) NOT NULL,
              "companyId" bigint NOT NULL,
              created_at timestamp with time zone NOT NULL DEFAULT now(),
              updated_at timestamp with time zone NOT NULL DEFAULT now(),
              PRIMARY KEY (id),
              CONSTRAINT "uq_users_email" UNIQUE (email)
            );
          `);

        //Chave estrangeira para tabela companies
        await queryRunner.query(`
            ALTER TABLE public."users"
            ADD CONSTRAINT "fk_companyId" FOREIGN KEY ("companyId")
            REFERENCES public."companies"("id")
            ON DELETE CASCADE
            ON UPDATE CASCADE;
          `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {

        //Drop Chave estrangeira para tabela companies
        await queryRunner.query(`
            ALTER TABLE public."users"
            DROP CONSTRAINT "fk_companyId";
          `);

        await queryRunner.query(`DROP TABLE IF EXISTS public."users";`);
    }

}
