# Sistema de Gerenciamento de Usuários

Este é um sistema de gerenciamento de usuários construído com Next.js, Prisma e Docker. Ele fornece uma base para aplicações que requerem autenticação de usuários e controle de acesso baseado em funções.

## Tecnologias Utilizadas

*   **Next.js 16:** Framework React para construir aplicações web full-stack com Turbopack.
*   **Prisma 6:** ORM moderno para Node.js e TypeScript.
*   **Docker:** Plataforma para desenvolver, enviar e executar aplicações em contêineres.
*   **TypeScript 5:** Superset tipado de JavaScript que compila para JavaScript puro.
*   **SQLite:** Motor de banco de dados SQL pequeno, rápido, autocontido e de alta confiabilidade.
*   **bcrypt:** Biblioteca para hash de senhas.

## Pré-requisitos

*   **Docker e Docker Compose**
*   **Make** (geralmente já instalado em sistemas Linux/macOS)
*   **Git**

## Início Rápido

### Executando com Docker (Recomendado)

1.  Clone o repositório:
    ```sh
    git clone https://github.com/Dev-Adrianoo/User-management.git
    ```
2.  Navegue até o diretório do projeto:
    ```sh
    cd User-management
    ```
3.  Inicie o ambiente de desenvolvimento:
    ```sh
    make up
    ```
    
    **Primeira vez rodando?** O comando detecta automaticamente e pergunta:
    ```
    Banco de dados não encontrado.
    Primeira vez rodando o projeto? (s/n)
    ```
    *   Digite **'s'** para setup completo (build, migrations, seed)
    *   Digite **'n'** para apenas iniciar os containers

4.  Acesse a aplicação em `http://localhost:3000`

**Credenciais padrão:** `admin @gmail.com` (senha definida em `prisma/seed.ts`)

## Comandos Make Disponíveis

O projeto utiliza um Makefile para automatizar tarefas comuns de desenvolvimento:

### Gerenciamento do Ambiente

| Comando        | Descrição                                                              |
| :------------- | :--------------------------------------------------------------------- |
| `make help`    | Exibe todos os comandos disponíveis                                    |
| `make up`      | Inicia o ambiente (detecta primeira vez automaticamente)               |
| `make first-run` | Força setup completo do zero                                         |
| `make down`    | Para os containers                                                     |
| `make restart` | Reinicia os containers sem rebuild                                     |
| `make status`  | Exibe o status dos containers                                          |
| `make logs`    | Acompanha os logs em tempo real (Ctrl+C para sair)                     |
| `make rebuild` | Reconstrói a imagem do zero (útil após mudanças no Dockerfile)         |

### Gerenciamento do Banco de Dados

| Comando          | Descrição                                                              |
| :--------------- | :--------------------------------------------------------------------- |
| `make seed`      | Popula o banco com dados iniciais (usuário admin)                      |
| `make reset`     | Reseta o banco de dados (apaga todos os dados e re-executa migrations) |
| `make migrate`   | Cria uma nova migration (solicita nome interativamente)                |
| `make schema-update` | Regenera Prisma Client após alterar `schema.prisma`                |
| `make studio`    | Abre o Prisma Studio em `http://localhost:5555`                        |

### Ferramentas de Desenvolvimento

| Comando        | Descrição                                                              |
| :------------- | :--------------------------------------------------------------------- |
| `make shell`   | Acessa o shell do container para debugging                             |
| `make install` | Instala um pacote npm (solicita nome e tipo interativamente)           |
| `make clean`   | Remove containers, volumes, imagens e banco de dados                   |

## Fluxo de Desenvolvimento

### Primeira Execução

```sh
# 1. Clonar e entrar no diretório
git clone https://github.com/Dev-Adrianoo/User-management.git
cd User-management

# 2. Iniciar ambiente
make up
# Responda 's' quando perguntado "Primeira vez rodando o projeto?"

# 3. Acessar aplicação
# http://localhost:3000
```
### Desenvolvimento Diário
```sh
# Iniciar
make up

# Acompanhar logs (opcional)
make logs

# Parar
make down
```
### Trabalhando com Schema do Banco
```sh
# 1. Edite prisma/schema.prisma

# 2. Regenere o Prisma Client
make schema-update

# 3. Crie a migration
make migrate

# 4. Reinicie o app
make restart
```
### Outros Comandos Úteis
```sh
# Visualizar dados com interface gráfica
make studio

# Resetar banco para estado inicial
make reset

# Instalar nova dependência
make install

# Recomeçar do zero
make clean
make up
# Responda 's' para setup completo
```
## Executando Localmente (Sem Docker)

Se preferir executar o projeto localmente sem Docker:

### Pré-requisitos

*   **Node.js** (versão 20 ou superior)
*   **npm** (versão 10 ou superior)

### Instalação

1.  Clone o repositório:
    ```sh
    git clone https://github.com/Dev-Adrianoo/User-management.git
    cd User-management
    ```
2.  Instale as dependências:
    ```sh
    npm install
    ```
3.  Configure o banco de dados:
    ```sh
    npx prisma migrate dev --name init
    ```
4.  Popule o banco de dados (opcional):
    ```sh
    npm run seed
    ```
5.  Inicie o servidor de desenvolvimento:
    ```sh
    npm run dev
    ```
A aplicação estará disponível em `http://localhost:3000`.

## Estrutura do Projeto

```
User-management/
├── app/                      # Código Next.js (App Router)
│   ├── api/                  # API Routes
│   ├── login/                # Página de login
│   └── signup/               # Página de cadastro
├── prisma/
│   ├── schema.prisma         # Schema do banco de dados
│   ├── seed.ts               # Script de seed (dados iniciais)
│   ├── prisma.config.ts      # Configuração do Prisma
│   └── migrations/           # Histórico de migrations
├── docker-compose.yml        # Configuração do Docker Compose
├── Dockerfile                # Imagem Docker (node:20-alpine)
├── Makefile                  # Automação de tarefas
├── package.json              # Dependências e scripts
└── tsconfig.json             # Configuração TypeScript
```

## Banco de Dados

### Tecnologia

Utilizamos Prisma como ORM para interagir com o banco de dados. O schema é definido em `prisma/schema.prisma`.

Para desenvolvimento, usamos SQLite (`prisma/dev.db`). Em produção, o Prisma suporta PostgreSQL, MySQL, SQL Server e MongoDB.

### Modelos

#### User

O modelo `User` possui os seguintes campos:

| Campo       | Tipo        | Descrição                                          |
| :---------- | :---------- | :------------------------------------------------- |
| `id`        | `String` (UUID) | Identificador único do usuário                     |
| `nome`      | `String`    | Nome completo do usuário                           |
| `email`     | `String`    | E-mail (único, usado para login)                   |
| `senhaHash` | `String`    | Senha criptografada com bcrypt                     |
| `cep`       | `String?`   | CEP (opcional)                                     |
| `estado`    | `String?`   | Estado (opcional)                                  |
| `cidade`    | `String?`   | Cidade (opcional)                                  |
| `role`      | `Role`      | Função do usuário (USER ou ADMIN)                  |
| `createdAt` | `DateTime`  | Data de criação                                    |
| `updatedAt` | `DateTime`  | Data da última atualização                         |

#### Role (Enum)

```prisma
enum Role {
  USER
  ADMIN
}
```

### Seed (Dados Iniciais)

Ao executar `make seed` ou responder 's' durante o `make up`, um usuário administrador é criado:

**Credenciais padrão:**

*   **Email:** `admin@gmail.com`
*   **Senha:** (definida em `prisma/seed.ts`)

⚠️ **Importante:** Altere as credenciais padrão antes de fazer deploy em produção.

## Autenticação

O sistema implementa autenticação baseada em funções (RBAC - Role-Based Access Control):

*   **USER:** Usuário padrão com permissões limitadas.
*   **ADMIN:** Administrador com permissões elevadas.

As senhas são armazenadas usando bcrypt com salt rounds configuráveis, garantindo segurança mesmo em caso de vazamento do banco de dados.

## Ambiente Docker

### Configuração

O projeto utiliza:

*   **Imagem base:** `node:20-alpine` (Alpine Linux para imagem leve)
*   **Binary targets:** Configurado para `linux-musl-openssl-3.0.x` (compatível com Alpine)
*   **Volumes:**
    *   `.:/app` - Código fonte (hot-reload)
    *   `/app/node_modules` - Dependências isoladas
    *   `/app/.next` - Cache do Next.js

### Fluxo de Inicialização

Quando você executa `make up`, o seguinte acontece:

1.  Docker Compose constrói a imagem (se necessário)
2.  Container inicia e executa:
    *   Verifica se Prisma Client existe (gera se necessário)
    *   `npx prisma migrate deploy` - Aplica migrations
    *   `npm run dev` - Inicia Next.js em modo desenvolvimento
3.  Aplicação fica disponível em `http://localhost:3000`

## Troubleshooting

### Container não inicia

```sh
# Verificar logs
make logs

# Reconstruir imagem
make rebuild
```

### Erro "Prisma Client not initialized"

```sh
# Regenerar Prisma Client
make schema-update

# Ou acessar container manualmente
make shell
npx prisma generate
exit
```

### Porta 3000 já está em uso

```sh
# Parar containers
make down

# Verificar processos usando a porta
lsof -i :3000

# Ou alterar porta no docker-compose.yml
ports:
  - "3001:3000"  # Usar porta 3001 no host
```

### Limpar tudo e recomeçar

```sh
# Remove containers, volumes, imagens e banco
make clean

# Reconstrói do zero
make up
# Responda 's' para setup completo
```

### Problemas com permissões (Linux)

Se encontrar erros de permissão no arquivo `dev.db`:

```sh
# Ajustar permissões
sudo chown -R $USER:$USER prisma/
```

## Variáveis de Ambiente

O projeto utiliza as seguintes variáveis (definidas no `docker-compose.yml`):

```env
NODE_ENV=development
DATABASE_URL=file:/app/prisma/dev.db
```

Para adicionar novas variáveis:

1.  Adicione no `docker-compose.yml`:
    ```yaml
    environment:
      - NOVA_VARIAVEL=valor
    ```
2.  Acesse no código:
    ```typescript
    process.env.NOVA_VARIAVEL
    ```

## Scripts NPM

| Script        | Descrição                               |
| :------------ | :-------------------------------------- |
| `npm run dev`   | Inicia servidor de desenvolvimento      |
| `npm run build` | Cria build de produção                  |
| `npm run start` | Inicia servidor de produção             |
| `npm run seed`  | Executa seed do banco de dados          |


## Contato

**Adriano Souza** - `@Dev-Adrianoo`

**Link do Projeto:** `https://github.com/Dev-Adrianoo/User-management`
