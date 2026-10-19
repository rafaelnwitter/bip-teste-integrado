FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app

COPY pom.xml .
COPY ejb-module/pom.xml ejb-module/
COPY backend-module/pom.xml backend-module/

RUN mvn dependency:go-offline -B

COPY ejb-module/src ejb-module/src
COPY backend-module/src backend-module/src

RUN mvn clean package -DskipTests

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

ENV SERVER_PORT=8085

COPY --from=build /app/backend-module/target/backend-module-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8085
ENTRYPOINT ["java", "-jar", "app.jar"]
