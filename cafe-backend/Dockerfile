# ==================== BUILD STAGE ====================
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

COPY pom.xml .
COPY src ./src

# ✅ build JAR bằng JDK 21
RUN mvn clean package -DskipTests

# ==================== RUNTIME STAGE ====================
FROM eclipse-temurin:21-jdk AS runtime
WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8081
ENTRYPOINT ["java", "-jar", "app.jar"]
