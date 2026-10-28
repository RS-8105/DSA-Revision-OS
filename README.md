# 🌲 DSA Revision OS

> **Algorithmic Spaced Repetition Platform** — Transform passive LeetCode grinding into active long-term mastery using evidence-based cognitive recall schedules.

---

## 📌 Overview

The biggest pitfall in technical interview preparation is the **forgetting curve**: developers often solve hundreds of algorithmic problems only to forget key patterns weeks later. 

**DSA Revision OS** solves this problem by applying the **Leitner Spaced Repetition System (SRS)** specifically to Data Structures & Algorithms. Instead of re-solving random problems, users track and reinforce their conceptual recognition of core patterns (e.g., Sliding Window, Two Pointers, Monotonic Stack) across optimized intervals (`1d` → `3d` → `7d` → `14d` → `30d`).

---

## 🚀 Key Features

* **🧠 Leitner Spaced Repetition Engine:** Automatically schedules review intervals based on self-reported recall performance (*Forgot*, *Struggled*, *Good*, *Easy*).
* **📚 17 Foundational DSA Patterns:** Pre-seeded pattern catalog with invariants, mental models, time/space complexity, and representative problem archetypes (LeetCode 75 / Blind 75).
* **⚡ Speed Revision Sessions:** Timed active recall environment with hotkeys (`1`–`4`, `Space`, `Enter`), scratchpads for invariants, and automated queue advancement.
* **📅 Revision Calendar & Queue:** Real-time visual timeline showing overdue, due today, and upcoming recall milestones.
* **📊 Analytics & Retention Telemetry:** Real-time mastery scores (0–100%), revision streaks, weak-area detection (mastery < 70%), and category radar breakdowns.
* **📝 Audit Ledger (Revision History):** Complete historical audit of every recall attempt, score delta, and date.
* **🌗 Botanical Obsidian Dark & Light Themes:** Custom aesthetic theme with instant toggle and persistent state.
* **🔐 Secure Authentication:** Stateless JWT authentication with Spring Security and BCrypt password encryption.
* **☁️ Cloud & Local Database Support:** Seamless compatibility with local PostgreSQL and cloud-hosted **Neon.tech** serverless PostgreSQL with SSL.

---

## 🔬 Leitner Spaced Repetition Protocol

When completing a revision cycle, the user evaluates their recall confidence into one of four assessment tiers:

| Assessment | Mastery Delta | Next Interval Tier | Stage Progression | Cognitive Meaning |
|---|:---:|:---:|:---:|---|
| **Forgot** | `-10%` | **1 Day** | Reset to Stage 1 | Mental model not recognized; immediate reset. |
| **Struggled** | `0%` | **3 Days** | Maintain Stage | Recognized with hints or excessive latency. |
| **Good** | `+6%` | **+1 Tier** (`3d`, `7d`, `14d`, `30d`) | Advance +1 Stage | Invariants and approach recalled smoothly. |
| **Easy** | `+12%` | **+2 Tiers** (`7d`, `14d`, `30d`) | Advance +2 Stages | Instant intuition, invariant proof immediate. |

---

## 🛠️ Technology Stack

### **Frontend**
* **Framework:** React 19 + Vite
* **Styling:** Vanilla CSS + Tailwind CSS (Custom Botanical Obsidian Theme)
* **Icons:** Google Material Symbols Outlined
* **State Management:** Reactive hooks + Centralized API client layer

### **Backend**
* **Framework:** Spring Boot 3.3.4 (Java 21)
* **Security:** Spring Security 6 + Stateless JWT (`jjwt-api 0.12.6`)
* **Persistence:** Spring Data JPA + Hibernate ORM
* **Database:** PostgreSQL (Compatible with Local PostgreSQL & Neon Serverless)
* **Connection Pool:** HikariCP with SSL connection pooling

---

## 📂 Project Architecture

```
DSA-Revision/
├── backend/                               # Spring Boot 3 REST API
│   ├── src/main/java/com/dsarevision/
│   │   ├── config/                        # Security, JWT, CORS, DataInitializer
│   │   ├── controller/                    # Auth, Pattern, Revision, Progress, Dashboard
│   │   ├── dto/                           # Request & Response DTOs
│   │   ├── entity/                        # JPA Entities (User, Pattern, Problem, etc.)
│   │   ├── exception/                     # Global exception handling & custom errors
│   │   ├── repository/                    # Spring Data JPA Repositories
│   │   └── service/                       # Spaced Repetition engine & business logic
│   ├── src/main/resources/
│   │   └── application.properties         # Datasource & application properties
│   ├── run.sh                             # Automatic local runner script
│   ├── .env.example                       # Environment variables template
│   └── pom.xml                            # Maven dependencies
│
├── frontend/                              # React 19 + Vite SPA
│   ├── src/
│   │   ├── api/                           # Centralized Axios/Fetch API client layer
│   │   ├── components/                    # Sidebar, Header, Modals (Auth, QuickLog, Add)
│   │   ├── views/                         # Dashboard, Codex, Calendar, Analytics, History
│   │   ├── App.jsx                        # Main state orchestrator & layout
│   │   ├── index.css                      # Tailwind base & Botanical Obsidian theme
│   │   └── main.jsx                       # React entry point
│   ├── package.json                       # Frontend dependencies
│   └── vite.config.js                     # Vite build configuration
│
├── .gitignore                             # Root git ignore
├── DSA_Revision_Tracker_PRD.md            # Product Requirements Document
└── README.md                              # Project documentation
```

---

## 🗄️ Database Schema

The application uses five core relational tables:

```
[ users ]
   ├── id (PK, BIGSERIAL)
   ├── name (VARCHAR)
   ├── email (VARCHAR, UNIQUE)
   ├── password (VARCHAR, BCrypt)
   └── created_at (TIMESTAMP)
         │
         ├──< [ user_patterns ] >──────────┐
         │       ├── id (PK)               │
         │       ├── user_id (FK)          │
         │       ├── pattern_id (FK)       │
         │       ├── mastery (INT: 0-100)  │
         │       ├── last_revised (DATE)   │
         │       ├── next_revision (DATE)  │
         │       └── revision_count (INT)  │
         │                                 │
         └──< [ revision_history ]         ▼
                 ├── id (PK)          [ patterns ]
                 ├── user_id (FK)        ├── id (PK, BIGSERIAL)
                 ├── pattern_id (FK)     ├── name (VARCHAR, UNIQUE)
                 ├── revision_date       ├── category (VARCHAR)
                 ├── confidence (ENUM)   ├── difficulty (VARCHAR)
                 └── notes (TEXT)        └── description (TEXT)
                                           │
                                           └──< [ problems ]
                                                   ├── id (PK)
                                                   ├── pattern_id (FK)
                                                   ├── title (VARCHAR)
                                                   ├── difficulty (VARCHAR)
                                                   └── link (VARCHAR)
```

---

## ⚡ Quickstart Guide

### 1. Prerequisites
- **Java:** JDK 21 or higher
- **Build Tool:** Maven 3.8+
- **Node.js:** v18 or higher (with npm)
- **Database:** Local PostgreSQL **or** a free cloud account on [Neon.tech](https://neon.tech)

---

### 2. Backend Setup

1. Open your terminal in the backend directory:
   ```bash
   cd backend
   ```

2. Configure your environment variables:
   Create a `.env` file from the provided template:
   ```bash
   cp .env.example .env
   ```

   **Using Neon Cloud PostgreSQL (Recommended):**
   ```properties
   DB_URL="jdbc:postgresql://<your-neon-host>.neon.tech/neondb?sslmode=require"
   DB_USERNAME="neondb_owner"
   DB_PASSWORD="your_neon_password"
   ```

   **Using Local PostgreSQL:**
   ```properties
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=dsa_revision
   DB_USER=postgres
   DB_PASSWORD=postgres
   ```

3. Run the Spring Boot application:
   ```bash
   ./run.sh
   ```
   *(Alternatively: `mvn spring-boot:run`)*

   The backend will start at **`http://localhost:8080`**. On initial startup, Hibernate automatically creates all database tables and seeds the 17 core DSA patterns along with a demo account.

---

### 3. Frontend Setup

1. In a separate terminal window, open the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies (if running for the first time):
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

---

## 👤 Demo Credentials

You can test the full authenticated workflow instantly without creating a new account:

* **Email:** `alex.rivera@example.com`
* **Password:** `password123`

*(You can also click **"Fill Demo Account"** inside the Sign In modal).*

---

## ⌨️ Active Revision Keyboard Shortcuts

During an active revision session (`Today's Revisions` view):

| Key | Action |
|:---:|---|
| `1` | Select **Forgot** recall rating |
| `2` | Select **Struggled** recall rating |
| `3` | Select **Good** recall rating |
| `4` | Select **Easy** recall rating |
| `Space` / `Tab` | Toggle Pattern Codex Dossier reveal |
| `Enter` | Save assessment & advance to next due pattern |

---

## 🌐 REST API Endpoints

### Authentication
* `POST /api/auth/register` — Register a new account
* `POST /api/auth/login` — Sign in and receive a JWT token
* `GET  /api/auth/me` — Retrieve current authenticated user profile

### Pattern Catalog
* `GET  /api/patterns` — List all available patterns (filterable by category/difficulty)
* `GET  /api/patterns/{id}` — Get single pattern details
* `GET  /api/patterns/{id}/problems` — List archetype problems for a pattern
* `POST /api/patterns` — Create custom pattern *(Authenticated)*

### Spaced Repetition & Progress
* `POST /api/revisions` — Record a completed revision and compute next review date
* `GET  /api/revisions/history` — Get full audit history for the authenticated user
* `GET  /api/progress` — Get user progress and mastery across all patterns
* `GET  /api/dashboard` — Get dashboard metrics, queues, streaks, and analytics

---

## 📄 License

This project is developed as an academic capstone / portfolio project and is open source under the [MIT License](LICENSE).
