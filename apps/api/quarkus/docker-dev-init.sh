#!/bin/sh
set -e

uid="${DOCKER_UID:-1000}"
gid="${DOCKER_GID:-1000}"

mkdir -p /m2/repository
chown -R "${uid}:${gid}" /m2/repository

exec gosu "${uid}:${gid}" env \
  MAVEN_OPTS="-Dmaven.repo.local=/m2/repository" \
  QUARKUS_PROFILE=dev \
  /usr/local/bin/docker-dev-entrypoint.sh
