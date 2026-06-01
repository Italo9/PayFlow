# PayFlow (payckout)

API de pagamentos e checkout multi-tenant construída com NestJS, TypeORM e PostgreSQL. Cada conta de cliente é uma `company`, e usuários, produtos, carrinhos, checkouts e pagamentos pertencem a uma company.

## Stack

- NestJS 11 (TypeScript)
- TypeORM 0.3 + PostgreSQL (`pg`)
- Validação com `class-validator` / `class-transformer`
- Hash de senha com `bcrypt`
- Geração de QR Code (`qrcode`) para o fluxo de cobrança

## Setup

```bash
yarn install
cp .env.example .env   # preencha as credenciais do banco
yarn start:dev
```

As migrations rodam automaticamente no boot (`migrationsRun: true`).

## Variáveis de ambiente

| Variável      | Descrição           | Padrão      |
| ------------- | ------------------- | ----------- |
| `PORT`        | Porta HTTP da API   | `3000`      |
| `DB_HOST`     | Host do PostgreSQL  | `localhost` |
| `DB_PORT`     | Porta do PostgreSQL | `5432`      |
| `DB_USER`     | Usuário do banco    | `postgres`  |
| `DB_PASSWORD` | Senha do banco      | —           |
| `DB_NAME`     | Nome do banco       | `payckout`  |

## Modelo de dados

`companies` -> `users` / `products` / `carts` -> `cart_items` / `checkouts` / `payments` / `payment_webhooks` / `company_settings`

As migrations ficam em `src/migrations/` e sao versionadas pela tabela `migrations`.

## Status

| Modulo            | Situacao                                        |
| ----------------- | ----------------------------------------------- |
| `user`            | Implementado (CRUD + hash de senha + validacao) |
| `company`         | A implementar                                   |
| `company-setting` | A implementar                                   |
| `checkout`        | A implementar                                   |
| `payment`         | A implementar (integracao + webhooks)           |

## Roadmap

- Implementar persistencia real nos modulos restantes seguindo o padrao de `user`
- Autenticacao JWT e guard por company (multi-tenant)
- Fluxo de checkout: carrinho -> cobranca -> QR Code
- Recebimento de webhooks de pagamento com verificacao de assinatura
- Testes de integracao dos fluxos criticos
