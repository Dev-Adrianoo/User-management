# Sistema de Gerenciamento de Usuários

Este é um sistema de gerenciamento de usuários construído com Next.js, Prisma e Docker. Ele fornece uma base para aplicações que requerem autenticação de usuários e controle de acesso baseado em funções.

## Tecnologias Utilizadas

*   **Next.js 16:** Framework React para construir aplicações web full-stack com Turbopack.
*   **Prisma 6:** ORM moderno para Node.js e TypeScript.
*   **Docker:** Plataforma para desenvolver, enviar e executar aplicações em contêineres.
*   **TypeScript 5:** Superset tipado de JavaScript que compila para JavaScript puro.
*   **Zod:** Biblioteca de declaração e validação de tipos.
*   **Sonner:** Biblioteca de notificações (toasts) para React.
*   **SQLite:** Motor de banco de dados SQL para desenvolvimento.
*   **bcrypt:** Biblioteca para hash de senhas.

## Principais Atualizações

*   **Arquitetura em Camadas e Módulos:** O projeto foi reestruturado para seguir um padrão claro de arquitetura, separando responsabilidades e facilitando a manutenção.
*   **Validação com Zod:** A validação de dados de entrada, tanto no frontend quanto no backend, agora é feita com Zod, garantindo mais segurança e consistência nos tipos.
*   **Feedback com Toasts:** A biblioteca Sonner foi integrada para fornecer feedback visual imediato (sucesso, erro, aviso) ao usuário após as operações.
*   **Modularização por Domínio:** O código foi organizado em módulos de domínio como `auth` e `users`, agrupando arquivos relacionados (hooks, providers, validações, etc.).

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

## Arquitetura do Projeto

O projeto adota uma arquitetura híbrida, combinando **Camadas (Layers)** com **Modularização por Domínio**.

### Camadas Principais

| Camada          | Responsabilidade                                                                      | Exemplos de Diretórios/Arquivos                               |
| :-------------- | :------------------------------------------------------------------------------------ | :------------------------------------------------------------ |
| **Presentation**  | Interface do usuário, componentes React, páginas, formulários e estilos.              | `src/app/*`, `src/components/*`                               |
| **Application**   | Lógica de negócio da aplicação, hooks, providers e validações (casos de uso).         | `src/hooks/*`, `src/providers/*`, `src/services/validations/*` |
| **Infrastructure**| Integrações com sistemas externos, bibliotecas e implementações de baixo nível.       | `src/lib/api.ts` (Axios), `services/jwt.ts`, API do ViaCEP      |
| **Data**          | Definição, migração e acesso aos dados.                                               | `prisma/schema.prisma`, `prisma/seed.ts`, `src/lib/prisma.ts` |

### Modularização por Domínio

Funcionalidades são agrupadas por domínio para aumentar a coesão e facilitar a localização de código relacionado.

*   `auth/`: Contém tudo relacionado à autenticação (rotas de API, hooks, providers, validações).
*   `users/`: Agrupa funcionalidades de gerenciamento de usuários (tipos, futuras rotas CRUD).
*   `shared/core/`: Reúne código compartilhado entre múltiplos domínios, como tipos genéricos, utilitários e providers globais (ex: `ToastProvider`).

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
