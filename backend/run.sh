#!/usr/bin/env bash
set -e

# Change directory to backend root
cd "$(dirname "$0")"

# Load .env if present
if [ -f .env ]; then
  set -a
  . ./.env
  set +a
  echo "✓ Loaded environment configuration from .env"
fi

# Sanitize DB_URL for PostgreSQL JDBC driver
if [ -n "$DB_URL" ]; then
  # If URL has user:password@host, extract them if not already set
  if [[ "$DB_URL" =~ @ ]]; then
    USER_PASS=$(echo "$DB_URL" | sed -nE 's|^(jdbc:)?postgresql://([^@]+)@.*|\2|p')
    if [ -z "$DB_USERNAME" ]; then
      export DB_USERNAME=$(echo "$USER_PASS" | cut -d: -f1)
    fi
    if [ -z "$DB_PASSWORD" ]; then
      export DB_PASSWORD=$(echo "$USER_PASS" | cut -d: -f2-)
    fi
    # Strip user:pass@ from DB_URL as required by org.postgresql.Driver
    export DB_URL=$(echo "$DB_URL" | sed -E 's|^(jdbc:)?postgresql://[^@]+@|jdbc:postgresql://|')
  elif [[ "$DB_URL" =~ ^postgresql:// ]]; then
    export DB_URL=$(echo "$DB_URL" | sed -E 's|^postgresql://|jdbc:postgresql://|')
  fi
  echo "✓ Prepared JDBC connection URL for PostgreSQL driver"
fi

echo "Starting Spring Boot DSA Revision Tracker backend..."
exec mvn spring-boot:run
