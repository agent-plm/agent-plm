.PHONY: dev down api web test migrate compose-config

COMPOSE = docker compose -f docker-compose.yml -f docker-compose.dev.yml

dev:
	$(COMPOSE) up --build

down:
	$(COMPOSE) down

api:
	./mvnw -pl apps/api/quarkus -am quarkus:dev

web:
	pnpm --filter @agent-plm/web dev

test:
	./mvnw -q verify
	pnpm --filter @agent-plm/web lint
	pnpm --filter @agent-plm/web build

migrate:
	@echo "Flyway runs when the API starts (quarkus.flyway.migrate-at-start=true)."

compose-config:
	$(COMPOSE) config >/dev/null
