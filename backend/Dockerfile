# ==============================================================================
# Build Stage: Compile and Package Spring Boot Application
# ==============================================================================
FROM maven:3.9.9-eclipse-temurin-21-alpine AS builder

WORKDIR /build

# Copy Maven POM descriptor first to cache dependencies
COPY pom.xml .

# Pre-fetch project dependencies offline
RUN mvn dependency:go-offline -B

# Copy project source tree
COPY src ./src

# Build executable production JAR (skip unit tests during image build)
RUN mvn clean package -DskipTests -B

# ==============================================================================
# Runtime Stage: Minimal JRE 21 Container
# ==============================================================================
FROM eclipse-temurin:21-jre-alpine

# Install bash and curl for runtime entrypoint and container healthcheck
RUN apk add --no-cache bash curl

# Create non-root system group and user for security hardening
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# Copy the generated JAR artifact from the builder stage
COPY --from=builder --chown=appuser:appgroup /build/target/*.jar /app/app.jar

# Copy and configure the startup script
COPY --chown=appuser:appgroup docker-entrypoint.sh /app/docker-entrypoint.sh
RUN sed -i 's/\r$//' /app/docker-entrypoint.sh && chmod +x /app/docker-entrypoint.sh

# Environment Defaults
ENV PORT=8080 \
    JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -Djava.security.egd=file:/dev/./urandom"

# Switch to non-root user
USER appuser

# Expose HTTP port
EXPOSE 8080

# Health check against Spring Boot health endpoint
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
    CMD curl -f http://127.0.0.1:${PORT}/api/health || exit 1

# Start application via entrypoint script
ENTRYPOINT ["/app/docker-entrypoint.sh"]

