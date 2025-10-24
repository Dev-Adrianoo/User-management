# Repository File Tree

Generated: 2025-10-24

Below is a hierarchical listing of the repository generated from a workspace scan.

.
├─ .env.example
├─ .gitignore
├─ Dockerfile
├─ Makefile
├─ README.md
├─ docker-compose.yml
├─ eslint.config.mjs
├─ next.config.ts
├─ package.json
├─ package-lock.json
├─ postcss.config.mjs
├─ prisma.config.ts
├─ tsconfig.json
├─ tsconfig.seed.json
├─ public
│  ├─ file.svg
│  ├─ favicon.ico
│  ├─ globe.svg
│  ├─ next.svg
│  ├─ vercel.svg
│  └─ window.svg
├─ prisma
│  ├─ dev.db
│  ├─ schema.prisma
│  ├─ prisma.config.ts
│  ├─ seed.ts
│  ├─ migrations
│  │  ├─ migration_lock.toml
│  │  └─ 20251022203733_init
│  │     └─ migration.sql
│  └─ prisma
│     └─ dev.db
└─ src
   ├─ app
   │  ├─ globals.css
   │  ├─ layout.tsx
   │  ├─ not-found.tsx
   │  └─ page.tsx
   │
   │  ├─ (auth)
   │  │  ├─ layout.tsx
   │  │  ├─ login
   │  │  │  └─ page.tsx
   │  │  └─ signup
   │  │     └─ page.tsx
   │  │
   │  ├─ (dashboard)
   │  │  ├─ layout.tsx
   │  │  ├─ dashboard
   │  │  │  ├─ layout.tsx
   │  │  │  └─ page.tsx
   │  │  └─ users
   │  │     └─ page.tsx
   │  │
   │  └─ api
   │     ├─ cep
   │     │  └─ [address]
   │     │     └─ route.ts
   │     ├─ auth
   │     │  ├─ login
   │     │  │  └─ route.ts
   │     │  ├─ logout
   │     │  │  └─ route.ts
   │     │  ├─ me
   │     │  │  └─ route.ts
   │     │  ├─ permissions
   │     │  │  └─ route.ts
   │     │  └─ register
   │     │     └─ route.ts
   │     └─ users
   │        ├─ route.ts
   │        └─ [id]
   │           └─ route.ts
   │
   ├─ components
   │  ├─ features
   │  │  ├─ auth
   │  │  │  ├─ login-form.tsx
   │  │  │  └─ signup-form.tsx
   │  │  ├─ dashboard
   │  │  │  ├─ admin-dashboard.tsx
   │  │  │  └─ user-dashboard.tsx
   │  │  └─ users
   │  │     └─ user-table.tsx
   │  └─ ui
   │     ├─ button.tsx
   │     ├─ input.tsx
   │     └─ sidebar.tsx
   │
   ├─ generated
   │  └─ prisma
   │     ├─ browser.ts
   │     ├─ client.ts
   │     ├─ commonInputTypes.ts
   │     ├─ enums.ts
   │     ├─ libquery_engine-debian-openssl-3.0.x.so.node
   │     ├─ models.ts
   │     └─ internal
   │        ├─ class.ts
   │        ├─ prismaNamespace.ts
   │        └─ prismaNamespaceBrowser.ts
   │     └─ models
   │        └─ User.ts
   │
   ├─ hooks
   │  ├─ use-auth.ts
   │  ├─ use-cep.ts
   │  └─ use-users.ts
   │
   ├─ lib
   │  ├─ api.ts
   │  ├─ jwt.ts
   │  ├─ permissions.ts
   │  ├─ prisma.ts
   │  ├─ utils.ts
   │  ├─ schemas
   │  │  ├─ auth.schema.ts
   │  │  └─ user.schema.ts
   │  └─ validations
   │     └─ user.ts
   │
   ├─ providers
   │  ├─ auth-provider.tsx
   │  └─ toast-provider.tsx
   │
   └─ types
      ├─ api.ts
      ├─ auth.ts
      └─ user.ts


Notes:
- This file was generated from a workspace scan on 2025-10-24.
- If you want the tree exported as JSON or filtered (for example only `src` or `prisma`), tell me and I can create that file too.
