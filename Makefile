SHELL := /bin/bash
.PHONY: help up down restart seed logs rebuild shell studio reset clean status install migrate first-run schema-update

GREEN := $(shell tput -T xterm setaf 2)
YELLOW := $(shell tput -T xterm setaf 3)
RED := $(shell tput -T xterm setaf 1)
BLUE := $(shell tput -T xterm setaf 4)
RESET := $(shell tput -T xterm sgr0)

COMPOSE := docker compose
SERVICE := app
DB_FILE := prisma/dev.db

.DEFAULT_GOAL := help

help:
	@echo "$(BLUE)Comandos disponíveis:$(RESET)"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(YELLOW)%-15s$(RESET) %s\n", $$1, $$2}'

up: ## Inicia o ambiente de desenvolvimento
	@if [ ! -f $(DB_FILE) ]; then \
		echo "$(BLUE)Banco de dados não encontrado.$(RESET)"; \
		read -p "Primeira vez rodando o projeto? (s/n) " -n 1 -r; \
		echo; \
		if [[ $$REPLY =~ ^[Ss]$$ ]]; then \
			$(MAKE) first-run; \
		else \
			echo "$(YELLOW)Iniciando containers...$(RESET)"; \
			$(COMPOSE) up -d; \
			sleep 10; \
			$(MAKE) status; \
			echo "$(GREEN)Ambiente iniciado$(RESET)"; \
		fi \
	else \
		echo "$(YELLOW)Iniciando containers...$(RESET)"; \
		$(COMPOSE) up -d; \
		sleep 5; \
		$(MAKE) status; \
		echo "$(GREEN)Ambiente iniciado$(RESET)"; \
		read -p "Popular banco de dados? (s/n) " -n 1 -r; \
		echo; \
		if [[ $$REPLY =~ ^[Ss]$$ ]]; then $(MAKE) seed; fi \
	fi

first-run: ## Configura o projeto pela primeira vez
	@echo "$(BLUE)═══════════════════════════════════════$(RESET)"
	@echo "$(BLUE)  Configuração inicial do projeto$(RESET)"
	@echo "$(BLUE)═══════════════════════════════════════$(RESET)"
	@echo "$(YELLOW)1/5 Construindo imagem Docker...$(RESET)"
	@$(COMPOSE) build --no-cache
	@echo "$(YELLOW)2/5 Iniciando containers...$(RESET)"
	@$(COMPOSE) up -d
	@echo "$(YELLOW)3/5 Aguardando inicialização...$(RESET)"
	@sleep 15
	@echo "$(YELLOW)4/5 Aplicando migrations...$(RESET)"
	@$(COMPOSE) exec $(SERVICE) npx prisma migrate deploy
	@echo "$(YELLOW)5/5 Populando banco de dados...$(RESET)"
	@$(COMPOSE) exec $(SERVICE) npx prisma db seed
	@$(MAKE) status
	@echo "$(GREEN)═══════════════════════════════════════$(RESET)"
	@echo "$(GREEN)  ✓ Ambiente configurado com sucesso!$(RESET)"
	@echo "$(GREEN)═══════════════════════════════════════$(RESET)"
	@echo "$(BLUE)Acesse: http://localhost:3000$(RESET)"
	@echo "$(BLUE)Credenciais: admin@gmail.com$(RESET)"
	@echo "$(BLUE)Senha: SenhaAdmin123@$(RESET)"

down: ## Para os containers
	@echo "$(YELLOW)Parando containers...$(RESET)"
	@$(COMPOSE) down
	@echo "$(GREEN)Containers parados$(RESET)"

restart: ## Reinicia os containers
	@echo "$(YELLOW)Reiniciando containers...$(RESET)"
	@$(COMPOSE) restart
	@sleep 5
	@$(MAKE) status
	@echo "$(GREEN)Containers reiniciados$(RESET)"

seed: ## Popula o banco de dados com dados de teste
	@echo "$(YELLOW)Executando seed...$(RESET)"
	@$(COMPOSE) exec $(SERVICE) npx prisma db seed
	@echo "$(GREEN)Seed concluído$(RESET)"

reset: ## Reseta o banco de dados
	@echo "$(RED)ATENÇÃO: Todos os dados serão apagados!$(RESET)"
	@read -p "Confirmar? (s/n) " -n 1 -r; \
	echo; \
	if [[ $$REPLY =~ ^[Ss]$$ ]]; then \
	  $(COMPOSE) exec $(SERVICE) npx prisma migrate reset --force; \
	  echo "$(GREEN)Banco resetado$(RESET)"; \
	fi

migrate: ## Cria nova migration
	@read -p "Nome da migration: " name; \
	echo "$(YELLOW)Criando migration: $$name$(RESET)"; \
	$(COMPOSE) exec $(SERVICE) npx prisma migrate dev --name $$name; \
	echo "$(GREEN)Migration criada$(RESET)"

schema-update: ## Atualiza Prisma Client após alterar schema.prisma
	@echo "$(YELLOW)Regenerando Prisma Client...$(RESET)"
	@$(COMPOSE) exec $(SERVICE) npx prisma generate
	@echo "$(GREEN)Prisma Client atualizado$(RESET)"
	@echo "$(BLUE)Dica: Execute 'make restart' para aplicar as mudanças$(RESET)"

studio: ## Abre Prisma Studio
	@echo "$(BLUE)Abrindo Prisma Studio...$(RESET)"
	@echo "$(BLUE)Acesse: http://localhost:5555$(RESET)"
	@$(COMPOSE) exec $(SERVICE) npx prisma studio

logs: ## Exibe logs em tempo real
	@echo "$(YELLOW)Acompanhando logs (Ctrl+C para sair)...$(RESET)"
	@$(COMPOSE) logs -f

shell: ## Acessa shell do container
	@echo "$(YELLOW)Acessando shell do container...$(RESET)"
	@$(COMPOSE) exec $(SERVICE) sh

status: ## Status dos containers
	@echo "$(BLUE)Status dos containers:$(RESET)"
	@$(COMPOSE) ps

rebuild: ## Reconstrói a imagem
	@echo "$(YELLOW)Reconstruindo imagem...$(RESET)"
	@$(COMPOSE) down
	@$(COMPOSE) build --no-cache
	@$(COMPOSE) up -d
	@sleep 10
	@$(MAKE) status
	@echo "$(GREEN)Rebuild concluído$(RESET)"

clean: ## Remove tudo (containers, volumes, imagens)
	@echo "$(RED)ATENÇÃO: Containers, volumes e imagens serão removidos!$(RESET)"
	@read -p "Confirmar? (s/n) " -n 1 -r; \
	echo; \
	if [[ $$REPLY =~ ^[Ss]$$ ]]; then \
	  $(COMPOSE) down -v --rmi local; \
	  rm -f $(DB_FILE); \
	  echo "$(GREEN)Limpeza concluída$(RESET)"; \
	fi

install: ## Instala pacote npm
	@read -p "Nome do pacote: " pkg; \
	read -p "Dev dependency? (s/n) " -n 1 -r; \
	echo; \
	if [[ $$REPLY =~ ^[Ss]$$ ]]; then \
	  echo "$(YELLOW)Instalando $$pkg como dev dependency...$(RESET)"; \
	  $(COMPOSE) exec $(SERVICE) npm install -D $$pkg; \
	else \
	  echo "$(YELLOW)Instalando $$pkg...$(RESET)"; \
	  $(COMPOSE) exec $(SERVICE) npm install $$pkg; \
	fi; \
	echo "$(GREEN)Pacote instalado$(RESET)"