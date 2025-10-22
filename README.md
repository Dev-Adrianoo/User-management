# Sistema de Gerenciamento de Usuários

Este é um sistema de gerenciamento de usuários construído com Next.js, Prisma e Docker. Ele fornece uma base para aplicações que requerem autenticação de usuários e controle de acesso baseado em funções.

## Tecnologias Utilizadas

*   **Next.js:** Um framework React para construir aplicações web full-stack.
*   **Prisma:** Um ORM para Node.js e TypeScript.
*   **Docker:** Uma plataforma para desenvolver, enviar e executar aplicações em contêineres.
*   **TypeScript:** Um superset tipado de JavaScript que compila para JavaScript puro.
*   **SQLite:** Uma biblioteca em linguagem C que implementa um motor de banco de dados SQL pequeno, rápido, autocontido, de alta confiabilidade e com todos os recursos.

## Executando com Docker (Recomendado)

Este projeto está configurado para ser executado em um contêiner Docker. Para construir e executar a aplicação, siga estes passos:

1.  Clone o repositório:
    ```sh
    git clone https://github.com/Dev-Adrianoo/User-management.git
    ```
2.  Navegue até o diretório do projeto:
    ```sh
    cd User-management
    ```
3.  Execute o docker-compose:
    ```sh
    docker-compose up -d --build
    ```
A aplicação estará disponível em `http://localhost:3000`.

## Executando Localmente

Se preferir executar o projeto localmente sem Docker, siga os passos abaixo.

### Pré-requisitos

*   Node.js (versão 18 ou superior)
*   npm
    ```sh
    npm install npm@latest -g
    ```

### Instalação

1.  Clone o repositório:
    ```sh
    git clone https://github.com/Dev-Adrianoo/User-management.git
    ```
2.  Instale as dependências:
    ```sh
    npm install
    ```
3.  Inicialize o banco de dados:
    ```sh
    npx prisma migrate dev --name init
    ```
4.  Inicie o servidor de desenvolvimento:
    ```sh
    npm run dev
    ```
A aplicação estará disponível em `http://localhost:3000`.


## Banco de Dados

Usamos o Prisma como nosso ORM para interagir com o banco de dados. O schema do banco de dados é definido em `prisma/schema.prisma`.

Estamos usando um banco de dados SQLite para desenvolvimento local. O arquivo do banco de dados está localizado em `prisma/dev.db`.

### Modelos

#### Usuário

O modelo `User` possui os seguintes campos:

*   `id`: Um identificador único para o usuário.
*   `nome`: O nome do usuário.
*   `email`: O endereço de e-mail do usuário (deve ser único).
*   `senhaHash`: A senha hash do usuário.
*   `cep`: O CEP do usuário (opcional).
*   `estado`: O estado do usuário (opcional).
*   `cidade`: A cidade do usuário (opcional).
*   `role`: A função do usuário, que pode ser `USER` ou `ADMIN`.
*   `createdAt`: A data e hora em que o usuário foi criado.
*   `updatedAt`: A data e hora em que o usuário foi atualizado pela última vez.

## Autenticação

A autenticação é tratada usando um sistema baseado em funções. O `enum Role` em `prisma/schema.prisma` define as funções disponíveis:

*   `USER`: Um usuário padrão com permissões limitadas.
*   `ADMIN`: Um administrador com permissões elevadas.

Esta abordagem permite uma maneira flexível e escalável de gerenciar as permissões dos usuários em toda a aplicação.