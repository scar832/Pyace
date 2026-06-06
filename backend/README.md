# Pyace Backend Specification & Architecture

Welcome to the backend architecture and specification document for **Pyace**, an EdTech platform combining the structural classroom management of an LMS (like Google Classroom) with the gamified engagement of Duolingo. This service operates as the bridge between our React frontend, a PostgreSQL database (hosted on Neon), and the OpenAI API for intelligent, rubric-based code evaluation.

---

## 1. Project Overview & Tech Stack

The Pyace backend is built using a modern, asynchronous Python stack optimized for fast I/O, strict schema enforcement, and seamless third-party API integration.

*   **Language Runtime:** Python 3.10+ (specifically targeting Python 3 code execution & grading submissions).
*   **Web Framework:** [FastAPI](https://fastapi.tiangolo.com/) (Asynchronous, self-documenting OpenAPI specs, high performance).
*   **Database:** [Neon](https://neon.tech/) (Serverless PostgreSQL with auto-scaling capabilities).
*   **Database Driver:** `asyncpg` (Asynchronous PostgreSQL client library).
*   **Object-Relational Mapping (ORM):** [SQLAlchemy 2.0](https://www.sqlalchemy.org/) (Async extension).
*   **Data Validation & Serialization:** [Pydantic v2](https://docs.pydantic.dev/) (Strict typing and parsing).
*   **LLM API Integration:** [OpenAI SDK](https://github.com/openai/openai-python) (Utilizing Structured Outputs / JSON Mode for code grading).

---

## 2. Core Backend Features

### A. Role-Based Authentication
*   **Roles:** Two explicit roles: `TEACHER` and `STUDENT`.
*   **Mechanism:** OAuth2 with Password Bearer flow, issuing signed JWT (JSON Web Token) access tokens.
*   **Access Control:** Custom FastAPI dependency injectors (e.g., `get_current_active_teacher`, `get_current_active_student`) to enforce route-level authorization.

### B. Class Management
*   **Creation:** Teachers can create Classes/Classrooms.
*   **Enrollment:** Each class generates a unique, secure, and URL-friendly **Invite Code** (e.g., `py-38x-abc`).
*   **Access Control:** Students join a class by submitting the invite code, which links their profile to the class table through an association model.

### C. Objective-Based AI Grading
*   **Rubric Structure:** Teachers define assignments containing specific learning **Objectives** (e.g., "Must use a `for` loop to accumulate a total", "Variable names must follow snake_case").
*   **Evaluation:** When a student submits a Python 3 script:
    1. The backend packages the code, description, and objectives into a structured system prompt.
    2. The payload is sent to OpenAI using structured JSON enforcement.
    3. OpenAI returns a standardized response detailing whether each objective was met, accompanied by targeted developer feedback.

### D. Gamification & XP Tracking
*   **XP Engine:** Students earn Experience Points (XP) upon completing assignments and meeting objectives.
*   **XP Rules:**
    *   *Base Submission XP:* Points awarded for submitting code.
    *   *Objective Completion XP:* Fixed XP per rubric objective successfully passed.
    *   *Streak Bonuses:* Consecutive active days yield XP multipliers.
*   **Leaderboards:** Aggregated queries to display ranking lists at the class, school, or global level.

---

## 3. Coding Standards & Architectural Rules

To maintain a maintainable, clean, and scalable codebase, all developers must adhere to the following standards:

### 3.1 Strict Separation of Concerns (Layered Architecture)
All modules must stay within their respective folders and respect the single-responsibility principle:

```
app/
├── core/         # Global configuration, security configurations, JWT utilities, constants.
├── database/     # DB connections, session managers, transaction helpers.
├── models/       # SQLAlchemy ORM models (Database representation only).
├── schemas/      # Pydantic schemas (Data serialization, validation, API payloads).
├── routers/      # FastAPI endpoint definitions (Controllers). Must contain thin route handlers.
└── services/     # Core business logic. Heavy computations, external APIs, DB queries live here.
```

*   **Routers are thin:** Routers should only validate requests (handled by FastAPI + Pydantic), call the appropriate service function, and return the response. No business logic or SQL queries should ever be written directly in routers.
*   **Services do the heavy lifting:** Service layer functions accept schemas or primitive types, coordinate database transactions, call OpenAI, evaluate game logic, and return Pydantic models or domain models.

### 3.2 Asynchronous Database Operations
*   No synchronous blocking database calls (no `session.commit()`, use `await session.commit()`).
*   Use `sqlalchemy.ext.asyncio.AsyncSession` for all transactions.
*   Inject the session into endpoints using a FastAPI dependency (`get_db` or similar).

### 3.3 Explicit Data Validation (Pydantic Schemas)
*   **Rule:** Database models (SQLAlchemy ORM objects) must **never** be exposed directly to the API clients to prevent unintended data leaks (e.g., password hashes, internal timestamps).
*   **Implementation:** 
    *   Use explicit schemas for input payloads (e.g., `UserCreate`, `AssignmentSubmit`).
    *   Use explicit schemas for response payloads (e.g., `UserResponse`, `GradingResult`).
    *   Enable `from_attributes = True` (Pydantic v2 configuration) on response schemas to allow seamless conversion from SQLAlchemy models.

### 3.4 Secret Management & Zero Client Exposure
*   Never hardcode credentials, connection strings, or API tokens.
*   All secrets (e.g., `DATABASE_URL`, `OPENAI_API_KEY`, `JWT_SECRET_KEY`) must be stored in `.env` files (git-ignored) and read via `pydantic-settings` (`Settings` class inside `app/core/config.py`).
*   The `OPENAI_API_KEY` and backend database URL must **never** be exposed through any API endpoint. All grading and db reads happen server-side.

---

## 4. AI Integration & Grading Strategy

To ensure deterministic, reliable, and parseable output from OpenAI, the backend will leverage OpenAI's Structured Outputs feature, forcing the response to conform exactly to a Pydantic JSON schema.

### 4.1 AI Prompt Construction Flow
When a student submits code, the backend dynamically constructs a prompt containing:
1. **System Prompt:** Sets the persona ("Expert Python Code Reviewer and Educator") and defines rules (only output JSON, format instructions, pedagogical tone).
2. **Assignment Context:** Title, description, starter code, and expected behavior.
3. **Rubric Objectives:** The explicit list of items defined by the teacher (ID, Title, Description, Max XP).
4. **Student Submission:** The raw Python 3 source code.

### 4.2 Structured Output Schema
The backend expects OpenAI to return a payload matching this exact JSON schema:

```json
{
  "score": 85,
  "passed_all_objectives": false,
  "objectives_evaluation": [
    {
      "objective_id": "obj-1",
      "satisfied": true,
      "feedback": "Excellent use of a for loop to aggregate the list elements."
    },
    {
      "objective_id": "obj-2",
      "satisfied": false,
      "feedback": "Expected the output variable to be named 'total_sum', but got 'result'. Please rename to match requirements."
    }
  ],
  "general_feedback": "Great overall logic! Double-check the variable naming convention specified in the rubric.",
  "syntax_valid": true
}
```

### 4.3 Pydantic Implementation for OpenAI Response
```python
from pydantic import BaseModel, Field
from typing import List

class ObjectiveGrading(BaseModel):
    objective_id: str = Field(description="The unique identifier of the objective being evaluated.")
    satisfied: bool = Field(description="True if the student's code met the objective, False otherwise.")
    feedback: str = Field(description="Specific, encouraging, and constructive feedback regarding this objective.")

class AIReviewResponse(BaseModel):
    score: int = Field(ge=0, le=100, description="Overall numerical score out of 100 based on standard fulfillment.")
    passed_all_objectives: bool = Field(description="True if all rubric objectives were successfully satisfied.")
    objectives_evaluation: List[ObjectiveGrading] = Field(description="Evaluation breakdown for each individual rubric objective.")
    general_feedback: str = Field(description="General feedback on coding style, efficiency, and clarity.")
    syntax_valid: bool = Field(description="Indicates if the submitted code is syntactically valid Python 3.")
```

Using the `instructor` library or raw `client.beta.chat.completions.parse` with the `response_format=AIReviewResponse` parameter, we guarantee structured type safety without risk of JSON parsing failures.

---

## 5. Directory Blueprint & Conventions

Please construct new features by separating files according to this pattern:

*   **Database Models:** `app/models/user.py`, `app/models/classroom.py`, `app/models/assignment.py`.
*   **Pydantic Schemas:** `app/schemas/user.py`, `app/schemas/classroom.py`, `app/schemas/assignment.py`.
*   **Routers:** `app/routers/auth.py`, `app/routers/classes.py`, `app/routers/assignments.py`.
*   **Services:** `app/services/auth.py`, `app/services/classroom.py`, `app/services/grader.py`.

---

> [!NOTE]  
> This specification represents the source of truth for the Pyace backend. Every new router, database model, service, or schema added to the application must align with the architectural rules and naming conventions outlined in this document.
