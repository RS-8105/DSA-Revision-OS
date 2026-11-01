#!/bin/bash
set -e

# Map DATABASE_URL to DB_URL if set (provided by Render, Railway, Neon, Heroku, etc.)
if [ -n "$DATABASE_URL" ] && [ -z "$DB_URL" ]; then
  DB_URL="$DATABASE_URL"
fi

# Sanitize connection string for PostgreSQL JDBC driver
if [ -n "$DB_URL" ]; then
  # If DB_URL contains embedded credentials (e.g., postgresql://user:pass@host:port/db)
  if echo "$DB_URL" | grep -q '@'; then
    USER_PASS=$(echo "$DB_URL" | sed -nE 's|^(jdbc:)?postgresql://([^@]+)@.*|\2|p')
    if [ -z "$DB_USERNAME" ] && [ -n "$USER_PASS" ]; then
      export DB_USERNAME=$(echo "$USER_PASS" | cut -d: -f1)
    fi
    if [ -z "$DB_PASSWORD" ] && [ -n "$USER_PASS" ]; then
      export DB_PASSWORD=$(echo "$USER_PASS" | cut -d: -f2-)
    fi
    # Strip user:pass@ from JDBC URL as required by org.postgresql.Driver
    export DB_URL=$(echo "$DB_URL" | sed -E 's|^(jdbc:)?postgresql://[^@]+@|jdbc:postgresql://|')
  elif echo "$DB_URL" | grep -qE '^postgresql://'; then
    export DB_URL=$(echo "$DB_URL" | sed -E 's|^postgresql://|jdbc:postgresql://|')
  fi
fi

# Set default JVM flags if not custom provided
JAVA_OPTS="${JAVA_OPTS:--XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -Djava.security.egd=file:/dev/./urandom}"

# Execute application process
exec java $JAVA_OPTS -jar /app/app.jar "$@"

