# syntax=docker/dockerfile:1
FROM eclipse-temurin:25-jdk-noble AS build
WORKDIR /src
COPY pom.xml mvnw ./
COPY .mvn .mvn
COPY kernel kernel
COPY modules modules
COPY sdk/java sdk/java
COPY apps/api/quarkus apps/api/quarkus
COPY migrations migrations
RUN chmod +x mvnw && ./mvnw -q -pl apps/api/quarkus -am package -DskipTests

FROM eclipse-temurin:25-jre-noble
WORKDIR /work
RUN useradd -r -u 1001 -g root plm
COPY --from=build --chown=1001:root /src/apps/api/quarkus/target/quarkus-app/lib/ /work/lib/
COPY --from=build --chown=1001:root /src/apps/api/quarkus/target/quarkus-app/*.jar /work/
COPY --from=build --chown=1001:root /src/apps/api/quarkus/target/quarkus-app/app/ /work/app/
COPY --from=build --chown=1001:root /src/apps/api/quarkus/target/quarkus-app/quarkus/ /work/quarkus/

EXPOSE 8080
USER 1001
ENV JAVA_OPTS_APPEND="-Dquarkus.http.host=0.0.0.0"
ENTRYPOINT ["java", "-jar", "/work/quarkus-run.jar"]
