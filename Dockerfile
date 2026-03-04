FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app

# Copy pom files
COPY pom.xml .
COPY ejb-module/pom.xml ejb-module/
COPY backend-module/pom.xml backend-module/

# Download dependencies
RUN mvn dependency:go-offline -B

# Copy source code
COPY ejb-module/src ejb-module/src
COPY backend-module/src backend-module/src

# Build the application
RUN mvn clean package -DskipTests

# Run stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Make the container listen on 8082 (Spring maps SERVER_PORT -> server.port)
ENV SERVER_PORT=8082

COPY --from=build /app/backend-module/target/backend-module-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8082
ENTRYPOINT ["java", "-jar", "app.jar"]
