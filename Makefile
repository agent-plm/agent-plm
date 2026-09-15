.PHONY: dev down api web test migrate compose-config gateway-certs gateway-certs-force gateway-check postgres-volume-reset

COMPOSE = docker compose -f docker-compose.yml -f docker-compose.dev.yml
DOCKER_BUILDKIT = 1
COMPOSE_DOCKER_CLIENT_BUILD = 1
export DOCKER_BUILDKIT COMPOSE_DOCKER_CLIENT_BUILD
export DOCKER_UID := $(shell id -u)
export DOCKER_GID := $(shell id -g)
GATEWAY_TLS_CERT = infra/gateway/tls/agent-plm.local.pem
GATEWAY_TLS_KEY = infra/gateway/tls/agent-plm.local-key.pem

gateway-certs:
	@command -v mkcert >/dev/null || { echo "Install mkcert: https://github.com/FiloSottile/mkcert"; exit 1; }
	@mkdir -p infra/gateway/tls infra/authelia/runtime
	@if [ ! -f $(GATEWAY_TLS_CERT) ]; then \
		mkcert -cert-file $(GATEWAY_TLS_CERT) -key-file $(GATEWAY_TLS_KEY) agent-plm.local; \
		echo "Generated $(GATEWAY_TLS_CERT)"; \
	fi

gateway-certs-force:
	@rm -f $(GATEWAY_TLS_CERT) $(GATEWAY_TLS_KEY)
	@$(MAKE) gateway-certs

gateway-check:
	@if ! grep -q '[[:space:]]agent-plm\.local' /etc/hosts 2>/dev/null; then \
		echo "agent-plm.local is missing from /etc/hosts. Run once:"; \
		echo "  echo '127.0.0.1 agent-plm.local' | sudo tee -a /etc/hosts"; \
		exit 1; \
	fi
	@if [ ! -f $(GATEWAY_TLS_CERT) ]; then \
		echo "Missing $(GATEWAY_TLS_CERT). Run: make gateway-certs"; \
		exit 1; \
	fi

dev: gateway-certs gateway-check
	$(COMPOSE) up --build

down:
	$(COMPOSE) down

web-volumes-reset:
	$(COMPOSE) down
	-docker volume rm agent-plm_web-root-node-modules agent-plm_web-app-node-modules agent-plm_web-pnpm-store 2>/dev/null

postgres-volume-reset:
	$(COMPOSE) down
	-docker volume rm agent-plm_postgres-data agent-plm_postgres-data-18 2>/dev/null
	@echo "Removed Postgres volumes. Run 'make dev' to initialize a fresh Postgres 18 database."

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
