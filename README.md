# StudyHub — Study & Interview Preparation System

StudyHub is a full-stack web application designed to help students organize their daily studies, track Data Structures and Algorithms (DSA) practice, and prepare for technical interviews and placements.

## Features

- **User Authentication:** Register, log in, and log out securely.
- **Study Planner:** Add study tasks, mark them as completed, and delete them.
- **DSA Tracker:** Track coding problems and their difficulty and solved status.
- **Interview Preparation:** Organize interview preparation topics and track completion.
- **Java Interview Questions:** Review Java interview questions and track review progress.
- **Progress Dashboard:** Monitor study and problem-solving progress.
- **User Data Separation:** Keep each user's study data separate.

## Technology Stack

- **Backend:** Java 21, Spring Boot
- **Frontend:** HTML, CSS, JavaScript
- **Database:** MySQL
- **Security:** Spring Security, BCrypt password hashing
- **Tools:** Visual Studio Code, Git, GitHub, Maven

## Project Structure

```text
StudyInterviewSystem/
├── backend/
│   └── studyinterviewsystem/
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
└── README.md
```

## Getting Started

### Prerequisites

- Java 21
- MySQL
- Apache Maven
- A modern web browser

### Run the Backend

1. Configure the MySQL database and credentials in `application.properties`.
2. Open a terminal in the backend project directory.
3. Run:

```bash
mvn spring-boot:run
```

The backend runs at `http://localhost:8080` by default.

### Run the Frontend

Open `frontend/index.html` using VS Code Live Server. The frontend is expected to run at `http://localhost:5500`.

Ensure the backend and MySQL are running before using the application.

## Project Goal

StudyHub demonstrates full-stack application development, Java programming, REST API integration, database persistence, authentication, and practical problem-solving.

## Project Status

Core features are implemented. Testing, improvements, and documentation are ongoing.

## Future Improvements

- Aptitude quizzes and technical assessments
- Enhanced analytics and progress reports
- Improved responsive design
- Additional interview preparation resources
