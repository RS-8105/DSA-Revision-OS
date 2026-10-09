# PRD — DSA Revision Tracker

## 1. Product Overview

**DSA Revision Tracker** is a UI-focused web application for students preparing for coding interviews and technical examinations.

The application helps students systematically revise important DSA patterns by tracking:
- What has been revised
- When it was last revised
- How well it was remembered
- What needs revision today
- What is coming up next
- Which patterns are strong or weak

The primary focus of the project is a polished, interactive **React frontend**, supported by a REST API backend.

---

## 2. Problem Statement

Students often solve many DSA problems but revise inconsistently. They may forget important problem-solving patterns because there is no structured system for tracking revision history and deciding when a topic should be revised again.

The application aims to provide a visual and structured way to manage long-term DSA revision.

---

## 3. Objective

Build a web application that:

1. Organizes DSA preparation around important problem-solving patterns.
2. Shows the student what should be revised today.
3. Records every revision and self-assessed performance.
4. Maintains revision history.
5. Schedules upcoming revisions.
6. Identifies weak and strong areas.
7. Provides visual progress and analytics.
8. Demonstrates strong client-side React development.

---

## 4. Target Users

### Primary User

Students preparing for:
- Coding interviews
- Technical examinations
- Competitive programming
- General DSA assessments

---

## 5. Core User Flow

```text
Open Dashboard
      ↓
See today's revisions
      ↓
Select a DSA pattern
      ↓
Enter Revision Mode
      ↓
Recall / solve / review
      ↓
Self-assess performance
      ↓
Record revision
      ↓
Calculate next revision date
      ↓
Dashboard updates
```

---

## 6. Main Features

### 6.1 Dashboard

The dashboard is the main screen.

It displays:
- Today's revisions
- Overdue revisions
- Upcoming revisions
- Overall mastery
- Revision streak
- Weak areas
- Recently revised patterns
- Progress summary

Example:

```text
Today's Revision

4 revisions due

• Sliding Window — Overdue
• Binary Search — Due today
• Tree Traversal — Due today
• Dijkstra — Due today
```

---

### 6.2 Pattern Library

DSA is organized by major categories and patterns.

Example categories:

- Arrays
- Strings
- Binary Search
- Linked Lists
- Stack & Queue
- Trees
- Graphs
- Greedy
- Backtracking
- Dynamic Programming

Each category shows:
- Number of patterns
- Mastery percentage
- Completed patterns
- Patterns requiring attention

---

### 6.3 Pattern Details

Each pattern has a dedicated page.

Example:

```text
Sliding Window

Mastery: 82%

Last revised: Oct 4
Next revision: Oct 11

Revision History
----------------
Oct 4   ★★★★
Sep 25  ★★★
Sep 12  ★★★★★
```

The page also contains associated problems and revision statistics.

---

### 6.4 Revision Mode

A focused interface for actually revising a pattern.

Flow:

```text
Recall
  ↓
Attempt
  ↓
Reveal / Review
  ↓
Self Assessment
  ↓
Revision Complete
```

The student evaluates their performance using options such as:

- Forgot
- Struggled
- Good
- Easy

The result affects the next revision date.

---

### 6.5 Revision Calendar

A visual calendar showing:

- Completed revisions
- Today's revisions
- Upcoming revisions
- Overdue revisions

The user can select a date to see the scheduled and completed revisions for that day.

---

### 6.6 Analytics

The analytics section visualizes:

- Overall DSA mastery
- Category-wise mastery
- Weakest patterns
- Strongest patterns
- Revision frequency
- Problems solved
- Revision streak
- Progress over time

Charts should be interactive where appropriate.

---

### 6.7 Revision History

The user can view all previous revisions.

Each record contains:

- Pattern
- Revision date
- Self-assessment
- Mastery at the time
- Next scheduled revision

---

## 7. Revision Scheduling

The application will use a simple spaced-revision model.

Example:

```text
Revision 1 → +1 day
Revision 2 → +3 days
Revision 3 → +7 days
Revision 4 → +14 days
Revision 5 → +30 days
```

Self-assessment can modify the schedule.

Example:

```text
Forgot        → Revise sooner
Struggled     → Short interval
Good          → Normal interval
Easy          → Longer interval
```

The exact scheduling algorithm can be refined during implementation.

---

## 8. UI / UX Requirements

The application should be **UI-heavy and polished**.

### Visual direction

- Modern developer-tool aesthetic
- Clean typography
- Dark mode
- Responsive layout
- Consistent design system
- Subtle animations
- Smooth transitions
- Interactive cards
- Progress indicators
- Charts and visualizations

### Important UI elements

- Sidebar navigation
- Dashboard cards
- Pattern cards
- Progress bars
- Calendar
- Charts
- Modals
- Search
- Filters
- Toast notifications
- Empty states
- Loading states
- Hover states

The application should feel like a real product rather than a basic college CRUD application.

---

## 9. Pages

The initial application will contain:

1. **Dashboard**
2. **Pattern Library**
3. **Pattern Details**
4. **Revision Mode**
5. **Revision Calendar**
6. **Analytics**
7. **Revision History**
8. **Settings**
9. **Login / Register**

The exact page count may be reduced if required by the mini-project timeline.

---

## 10. React Requirements

The project should demonstrate core React concepts.

### Components

Create reusable components such as:

- PatternCard
- ProgressCard
- RevisionCard
- Calendar
- Chart
- Sidebar
- Modal
- Button
- Badge
- Avatar
- EmptyState

### React concepts

The project should demonstrate:

- Functional components
- Props
- State
- Event handling
- Conditional rendering
- Lists and keys
- Forms
- `useState`
- `useEffect`
- Custom hooks
- Context where appropriate
- React Router
- API integration

---

## 11. Backend

The backend exists primarily to support the React application.

### Suggested stack

- Spring Boot
- REST API
- PostgreSQL

### Responsibilities

The backend will manage:

- Users
- DSA patterns
- Problems
- Revision records
- Revision history
- Upcoming revision dates
- User progress

---

## 12. High-Level Architecture

```text
                 React Frontend
                       │
                       │ REST API
                       ▼
                Spring Boot API
                       │
                       ▼
                  PostgreSQL
```

Frontend should remain the primary focus of development.

Target effort:

**~70% frontend / ~30% backend**

---

## 13. Initial Data Model

### User

```text
id
name
email
password
created_at
```

### Pattern

```text
id
name
category
difficulty
description
```

### Problem

```text
id
pattern_id
title
difficulty
link
```

### UserPattern

```text
id
user_id
pattern_id
mastery
last_revised
next_revision
revision_count
```

### RevisionHistory

```text
id
user_id
pattern_id
revision_date
confidence
notes
```

---

## 14. MVP Scope

The minimum viable version should include:

### Frontend

- Dashboard
- Pattern Library
- Pattern Details
- Revision Mode
- Calendar
- Basic Analytics
- Responsive design
- Dark mode

### Backend

- Authentication
- Pattern retrieval
- Revision creation
- Revision history
- Progress retrieval
- Upcoming revision retrieval

### Database

Store:
- Users
- Patterns
- Problems
- Revision history
- User progress

---

## 15. Future Enhancements

These are explicitly outside the initial MVP and can be added if time permits:

- AI-generated revision questions
- LeetCode integration
- GitHub integration
- Notifications
- Email reminders
- Advanced spaced-repetition algorithm
- Import/export progress
- Multiple revision plans
- PWA support
- Mobile application

These should not be added until the core application is polished.

---

## 16. Non-Goals

The project is not intended to become:

- A full competitive programming platform
- A replacement for LeetCode
- A social networking platform
- A complete online judge
- An AI coding assistant
- A large-scale learning management system

The primary purpose is **DSA revision management**.

---

## 17. Success Criteria

The project will be considered successful when a student can:

1. Log in.
2. View their DSA progress.
3. Browse important DSA patterns.
4. Start a revision.
5. Record how well they remembered it.
6. See the revision added to their history.
7. Receive a calculated next revision date.
8. View upcoming revisions on the calendar.
9. Identify weak areas through analytics.
10. Use the application comfortably on desktop and mobile.

---

## 18. Academic Value

This project demonstrates:

- Client-side development with React
- Component-based UI architecture
- State management
- Routing
- Form handling
- API communication
- REST architecture
- Database integration
- Data visualization
- Responsive web design
- User experience design

The project is suitable for a **Client Side Server Framework mini-project** because the frontend is the primary component while still demonstrating client-server communication.

---

## 19. Project Principle

> **The goal is not to track how many DSA problems a student has solved.**
>
> **The goal is to make sure important DSA patterns are not forgotten.**

The application should answer one question whenever the student opens it:

**"What should I revise today?"**
