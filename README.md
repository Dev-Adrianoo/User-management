# Sistema de Gerenciamento de Usuários

Este é um sistema de gerenciamento de usuários construído com Next.js, Prisma e Docker. Ele fornece uma base para aplicações que requerem autenticação de usuários e controle de acesso baseado em funções (RBAC).

## Tecnologias Utilizadas

*   **Framework Principal:** **Next.js (App Router)** - Para renderização de componentes de servidor e cliente, e roteamento.
*   **Linguagem:** **TypeScript** - Para tipagem estática e segurança no código.
*   **Estilização:**
    *   **Tailwind CSS:** Framework CSS utilitário para estilização rápida e customizável.
    *   **shadcn/ui:** Coleção de componentes de UI reutilizáveis e acessíveis.
    *   **Framer Motion:** Biblioteca para animações fluidas e declarativas.
*   **Gerenciamento de Estado e Dados:**
    *   **React Context API (`AuthProvider`/`useAuth`):** Para gerenciamento do estado global de autenticação.
    *   **SWR:** Para data fetching e cache de dados no frontend (hooks `useUsers`, `useCep`).
*   **Formulários:**
    *   **React Hook Form:** Para construção de formulários performáticos e flexíveis.
    *   **Zod:** Para validação de schemas de dados tanto no frontend quanto no backend.
*   **Backend e Banco de Dados:**
    *   **Prisma:** ORM para interação com o banco de dados.
    *   **SQLite:** Banco de dados para o ambiente de desenvolvimento.
*   **Autenticação e Segurança:**
    *   **JWT (jsonwebtoken):** Para criação e validação de tokens de autenticação.
    *   **bcryptjs:** Para hashing seguro de senhas.
    *   **Utilitário `toPublicUser`:** Garante que dados sensíveis do usuário (como a senha) nunca sejam expostos nas respostas da API.

## Arquitetura do Projeto

O projeto adota uma arquitetura moderna e modular, focada em separação de responsabilidades e escalabilidade.

### Backend (API Routes)

O backend segue o padrão **Controlador-Serviço** para organizar a lógica de negócio de forma clara e desacoplada.

*   **Controladores (`route.ts`):**
    *   **Responsabilidade:** Lidar exclusivamente com o ciclo de vida HTTP (Request e Response).
    *   **Função:** Receber requisições, validar parâmetros de rota, chamar o serviço correspondente para executar a lógica de negócio e retornar a resposta HTTP adequada. São mantidos "magros" (thin).
    *   **Localização:** `src/app/api/**/route.ts`

*   **Serviços (`*.service.ts`):**
    *   **Responsabilidade:** Conter toda a lógica de negócio da aplicação.
    *   **Função:** Interagir com o banco de dados (via Prisma), integrar com APIs externas (como ViaCEP), validar dados (com Zod), e executar regras de negócio. São mantidos "gordos" (fat).
    *   **Serviços Implementados:**
        *   `authService`: Lida com registro, login e validação de sessão.
        *   `userService`: Gerencia as operações de CRUD para usuários.
        *   `cepService`: Busca informações de endereço a partir de um CEP em uma API externa.
    *   **Localização:** `src/services/*.ts`

### Frontend

*   **Estrutura de Roteamento:**
    *   **App Router:** Utiliza o roteador do Next.js para criar rotas baseadas no sistema de arquivos.
    *   **Route Groups:** Os diretórios `(auth)` e `(dashboard)` agrupam rotas que compartilham layouts ou lógicas específicas, sem afetar a URL final.
*   **Organização de Componentes:**
    *   `src/components/ui/`: Componentes de UI genéricos e reutilizáveis (Button, Input, etc.), muitos deles vindos do `shadcn/ui`.
    *   `src/components/features/`: Componentes mais complexos que implementam funcionalidades específicas (ex: `login-form.tsx`, `admin-dashboard.tsx`).
*   **Gerenciamento de Estado:**
    *   O `AuthProvider` (via React Context) provê o estado de autenticação (usuário, token, permissões) para toda a aplicação.
*   **Hooks Customizados:**
    *   `useAuth`: Hook para acessar o contexto de autenticação e interagir com o `authService`.
    *   `useUsers`: Hook para buscar e gerenciar dados de usuários, utilizando SWR.
    *   `useCep`: Hook para buscar dados de CEP, utilizando SWR.
*   **Controle de Acesso (RBAC):**
    *   O controle de acesso no frontend é implementado de forma declarativa. O hook `useAuth` expõe um array de `permissions` do usuário logado.
    *   Componentes, páginas e elementos de UI são renderizados condicionalmente verificando se a permissão necessária está presente: `permissions.includes(...)`.
    *   As permissões disponíveis estão centralizadas em `src/lib/permissions.ts`.

### Animações

*   **Framer Motion:** Utilizado para adicionar animações de entrada e transições suaves em elementos da UI, como nos formulários de login/cadastro e nos dashboards.
*   **Variantes Centralizadas:** Para garantir consistência e reuso, as variantes de animação (ex: `fadeIn`, `slideIn`) estão definidas em `src/lib/animation.ts` e podem ser importadas em qualquer componente.

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
3.  **Configure as Variáveis de Ambiente:**
    Copie o arquivo de exemplo `.env.example` para um novo arquivo chamado `.env`.
    ```sh
    cp .env.example .env
    ```
    *Consulte a seção "Variáveis de Ambiente" abaixo para mais detalhes.*

4.  Inicie o ambiente de desenvolvimento:
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

5.  Acesse a aplicação em `http://localhost:3000`

**Credenciais padrão:** `admin@gmail.com` (senha definida em `prisma/seed.ts`)

## Variáveis de Ambiente

Este projeto requer a configuração de variáveis de ambiente para funcionar corretamente. Siga os passos abaixo.

1.  **Crie o arquivo `.env`:**
    Copie o template `.env.example` para criar seu arquivo de configuração local.
    ```sh
    cp .env.example .env
    ```

2.  **Preencha as variáveis:**
    Abra o arquivo `.env` e preencha as seguintes variáveis:

    *   `DATABASE_URL`
        *   **Propósito:** String de conexão para o banco de dados.
        *   **Valor Padrão (Docker):** O valor já vem configurado no `docker-compose.yml` para usar o banco de dados SQLite dentro do contêiner (`file:/app/prisma/dev.db`). **Não é necessário alterar para o ambiente de desenvolvimento padrão.**

    *   `JWT_SECRET`
        *   **Propósito:** Chave secreta usada para assinar os tokens de autenticação (JWT). É crucial que seja um valor longo, aleatório e mantido em segredo.
        *   **Valor para Desenvolvimento:** Para fins de desenvolvimento, você pode usar uma string simples.
        *   **Gerando um Segredo Seguro:** Para um ambiente de produção (ou para seguir as melhores práticas), gere uma chave segura usando um comando como este no seu terminal:
            ```sh
            openssl rand -hex 32
            ```
            Copie o resultado e cole no seu arquivo `.env`.

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

# Acompanhar logs 
make logs

# Parar
make down
```

## Contato

**Adriano Souza** - `@Dev-Adrianoo`

**Link do Projeto:** `https://github.com/Dev-Adrianoo/User-management`
