# DSA Revision Tracker — Backend

Spring Boot REST API backend for the DSA Revision Tracker.

## Prerequisites

- **Java Development Kit (JDK):** Version 21 or higher
- **Maven:** Version 3.8 or higher
- **PostgreSQL:** Version 14 or higher

---

## 1. PostgreSQL Setup

1. Start your local PostgreSQL server:
   ```bash
   sudo systemctl start postgresql
   ```

2. Create the application database using `psql`:
   ```bash
   sudo -u postgres psql -c "CREATE DATABASE dsa_revision;"
   ```

3. (Optional) Create a dedicated database user if not using the default `postgres` user:
   ```bash
   sudo -u postgres psql -c "CREATE USER dsa_user WITH ENCRYPTED PASSWORD 'dsa_password';"
   sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE dsa_revision TO dsa_user;"
   ```

---

## 2. Environment Configuration

Copy the sample environment template and fill in your credentials:

```bash
cp .env.example .env
```

Export variables in your terminal session, or set them directly:

```bash
export DB_HOST=localhost
export DB_PORT=5432
export DB_NAME=dsa_revision
export DB_USER=postgres
export DB_PASSWORD=your_postgres_password
```

Default fallback values are configured in `src/main/resources/application.properties` (`localhost:5432/dsa_revision`, user: `postgres`, password: `postgres`).

---

## 3. Build & Run the Backend

From the `backend/` directory:

### Run with Maven Spring Boot Plugin
```bash
mvn spring-boot:run
```

### Alternatively, Build and Run the Packaged JAR
```bash
mvn clean package -DskipTests
java -jar target/dsa-revision-backend-0.0.1-SNAPSHOT.jar
```

The API will start at: `http://localhost:8080`

### Verify Server Health
```bash
curl http://localhost:8080/api/health
```

Expected response:
```json
{
  "status": "UP",
  "service": "DSA Revision Tracker API",
  "version": "0.0.1-SNAPSHOT",
  "timestamp": "..."
}
```
