#!/bin/sh
set -e

export MAVEN_OPTS="${MAVEN_OPTS:--Dmaven.repo.local=/m2/repository}"
cd /repo
chmod +x mvnw

exec ./mvnw -pl apps/api/quarkus -am quarkus:dev \
  -Dquarkus.http.host=0.0.0.0 \
  -Dquarkus.profile=dev \
  -Dquarkus.observability.enabled=false \
  -Dquarkus.test.continuous-testing=disabled
