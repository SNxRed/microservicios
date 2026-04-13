# Etapa 1: Construcción con Maven y Java 21
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
# Compilamos omitiendo los tests para mayor velocidad
RUN mvn clean package -DskipTests

# Etapa 2: Ejecución con un entorno ligero de Java 21
FROM eclipse-temurin:21-jdk-alpine
WORKDIR /app
# Copiamos el .jar generado (Spring Boot 4.x sigue empaquetándolo en target/)
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]