# Full-Stack Online Quiz Application (Project-II)

A modular, full-stack quiz web application developed as an extension of Project-I for the **Web Technologies (CTE204)** module. The application utilizes a pure vanilla JavaScript frontend connected asynchronously to a robust, modular RESTful API built on Node.js, Express.js, and an SQLite relational database.

---

## 🚀 Key Project Features

* **Persistent Architecture:** Moves away from client-side state memory to full server-side data persistence.
* **Dynamic Round Generation:** The backend holds a pool of **20 questions**; the frontend shuffles and extracts a randomized slice of exactly **10 questions** per attempt.
* **Three-Lives Mechanic:** Standardized gamification engine limiting player error thresholds to exactly 3 lives (`❤️❤️❤️`) per attempt.
* **Relational Logging:** Automated collection of student performance metadata (scores, percentage, and time stamps) stored directly into relational tables upon quiz completion or termination.

---

## 📂 System Architecture & Folder Layout

The project adheres strictly to a clean, modular **Separation of Concerns Pattern** to maximize code readability and decoupling:

```text
Quiz_02240154_project2/
│
├── src/                      # Backend Source Directory
│   ├── controllers/          # Business logic & Database interaction handler functions
│   │   └── quizController.js
│   ├── middleware/           # Centralized application interceptors
│   │   └── errorHandler.js
│   ├── models/               # Relational schema definition & DB instance initialization
│   │   └── db.js
│   └── routes/               # REST API Endpoint definitions mapped to URL paths
│       └── quizRoutes.js
│
├── .env                      # Local environmental application configurations (PORT, DB paths)
├── .gitignore                # Version control safety definitions
├── app.js                    # Core Express server bootstrap file
├── index.html                # Frontend UI element layout configuration
├── script.js                 # Client-side DOM manipulation and async Fetch API controller
└── style.css                 # Responsive UI variable styling sheets
## 🌐 REST API Endpoint Specifications

| HTTP Method | API Endroute Path | Description | Access Request payload | Status Code |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | `/api/questions` | Pulls the entire question bank from SQLite and formats the array. | None | `200 OK` |
| **POST** | `/api/attempts` | Saves student attempt data securely using parameterized inputs. | `{ username: String, score: Number, percentage: Number }` | `201 Created` |
| **PUT** | `/api/questions/:id`| Updates an existing question's text or choices (Full CRUD). | `{ q: String, o1: String... c: Number }` | `200 OK` |
| **DELETE**| `/api/attempts/:id` | Deletes a specific student attempt record from history (Full CRUD). | None | `200 OK` |  
⚙️ Local Installation & Execution Guide
Follow these steps to spin up the local hosting environment on your machine:

1. Prerequisite Installations
Ensure you have Node.js (LTS version) installed on your system.

2. Clone the Repository
Open your local terminal window and run:

Bash
git clone [https://github.com/jigmelosel02240154/Quiz_02240154_project2.git](https://github.com/jigmelosel02240154/Quiz_02240154_project2.git)
cd Quiz_02240154_project2
3. Install Module Dependencies
Execute npm package installation to restore all server packages listed inside package.json:

Bash
npm install
4. Create Environment Rules Configuration
Verify that a .env file exists in your project root with the following definitions:

Code snippet
PORT=3000
DB_FILE=./quiz_database.db
5. Start the Live Server Run Loop
Boot up the backend server in development mode (utilizing nodemon to track hot-reloads):

Bash
npm run dev
6. Access the Application Interface
Open any modern web browser and navigate to:
👉 http://localhost:3000

🛠️ Technology Stack Ecosystem
Frontend User Interface: Pure Semantic HTML5, CSS3 Custom Properties (Variables), and Asynchronous Vanilla JavaScript (ES6+ Fetch API).

Runtime Environment: Node.js JavaScript execution environment.

Server Framework: Express.js framework implementing REST architectural mappings and static delivery routers.

Database Engine: SQLite management engine utilizing better-sqlite3 for native, low-latency execution and protection against SQL-injection vectors via parameterized queries.