.PHONY: dev down api web test migrate compose-config authelia-certs

COMPOSE = docker compose -f docker-compose.yml -f docker-compose.dev.yml
DOCKER_BUILDKIT = 1
COMPOSE_DOCKER_CLIENT_BUILD = 1
export DOCKER_BUILDKIT COMPOSE_DOCKER_CLIENT_BUILD
export DOCKER_UID := $(shell id -u)
export DOCKER_GID := $(shell id -g)
AUTHELIA_TLS_CERT = infra/authelia/tls/cert.pem
AUTHELIA_TLS_KEY = infra/authelia/tls/key.pem

authelia-certs:
	@mkdir -p infra/authelia/tls infra/authelia/runtime
	@if [ ! -f $(AUTHELIA_TLS_CERT) ]; then \
		openssl req -x509 -nodes -newkey rsa:4096 -days 3650 \
			-keyout $(AUTHELIA_TLS_KEY) \
			-out $(AUTHELIA_TLS_CERT) \
			-subj "/CN=plm.lvh.me" \
			-addext "subjectAltName=DNS:plm.lvh.me,DNS:localhost,IP:127.0.0.1"; \
		echo "Generated $(AUTHELIA_TLS_CERT)"; \
	fi

authelia-certs-force:
	@rm -f $(AUTHELIA_TLS_CERT) $(AUTHELIA_TLS_KEY)
	@$(MAKE) authelia-certs

dev: authelia-certs
	$(COMPOSE) up --build

down:
	$(COMPOSE) down

web-volumes-reset:
	$(COMPOSE) down
	-docker volume rm agent-plm_web-root-node-modules agent-plm_web-app-node-modules agent-plm_web-pnpm-store 2>/dev/null

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
