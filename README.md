# PayFlow (payckout)

API de pagamentos e checkout multi-tenant em NestJS, TypeORM e PostgreSQL. Cada cliente é uma `company` que possui usuários, produtos, carrinhos, checkouts e pagamentos. A cobrança PIX é feita via gateway Payco, com confirmação por webhook.

## Stack

- NestJS 11 (TypeScript)
- TypeORM 0.3 + PostgreSQL (`pg`)
- Redis (`ioredis`)
- Autenticação via Stack Auth (arquitetura hexagonal: ports/adapters)
- Validação com `class-validator` / `class-transformer`
- Hash de senha com `bcrypt`
- Geração de QR Code (`qrcode`)
- Documentação via Swagger (`@nestjs/swagger`)

## Setup

```bash
yarn install
cp .env.example .env   # preencha as credenciais
yarn start:dev
```

Com a aplicação no ar, o Swagger fica em `/api/docs`.

## Banco de dados

```bash
yarn migration:run   # roda as migrations
yarn seed            # cria company e usuario admin iniciais
```

## Variáveis de ambiente

| Variável | Descrição |
| -------- | -------- |
| `DB_HOST` / `DB_PORT` / `DB_USERNAME` / `DB_PASSWORD` / `DB_DATABASE` | Conexão PostgreSQL |
| `STACK_SECRET_SERVER_KEY` / `NEXT_PUBLIC_STACK_PROJECT_ID` | Credenciais do Stack Auth |
| `PAYCO_CLIENT_ID` / `PAYCO_CLIENT_SECRET` / `PAYCO_AUTH_URL` | Credenciais do gateway Payco |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` | Envio de e-mail |

## Módulos

`auth` (Stack Auth, JWT, sessões) · `user` · `company` · `company-setting` · `products` · `carts` · `carts_items` · `checkout` · `payment` · `webhook`

## Fluxo de checkout

`carrinho -> itens -> checkout -> cobrança PIX (Payco) -> webhook de confirmação`

## Status e melhorias previstas

- Mover a chave de derivação de criptografia e segredos de gateway para variáveis de ambiente
- Cobrir os fluxos de checkout e webhook com testes de integração
- Trocar a senha do admin de seed por geração aleatória com obrigação de troca no primeiro login
