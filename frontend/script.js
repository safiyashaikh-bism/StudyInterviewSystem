let tasks = JSON.parse(localStorage.getItem("studyTasks")) || [];

let dsaProblems = [];

let interviewTopics = [];

function saveTasks() {
    localStorage.setItem("studyTasks", JSON.stringify(tasks));
}

function displayTasks() {
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = "";

    tasks.forEach(function (task, index) {
        const li = document.createElement("li");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;

        const taskLabel = document.createElement("span");
        taskLabel.textContent = task.text;
        taskLabel.className = "task-text";

        if (task.completed) {
            taskLabel.style.textDecoration = "line-through";
        }

        checkbox.addEventListener("change", async function () {
            const previousStatus = tasks[index].completed;
            const newStatus = checkbox.checked;

            // Update the webpage
            tasks[index].completed = newStatus;
            saveTasks();
            displayTasks();

            try {
                
const response = await fetch(
    `http://localhost:8080/api/tasks/${task.id}`,
    {
        method: "PUT",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            completed: newStatus
        })
    }
);


                if (!response.ok) {
    const errorDetails = await response.text();

    console.error("HTTP status:", response.status);
    console.error("Backend response:", errorDetails);

    throw new Error("Failed to update task");
}

                console.log("Task completion updated in backend!");

            } catch (error) {
                console.error("Could not update backend:", error);

                // Restore the previous status if the update fails
                tasks[index].completed = previousStatus;
                saveTasks();
                displayTasks();

                alert("Could not update task in the backend.");
            }
        });

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-button";

        
deleteButton.addEventListener("click", async function () {
    try {
        const response = await fetch(
            `http://localhost:8080/api/tasks/${task.id}`,
            {
    method: "DELETE",
    credentials: "include"
}
        );

        if (!response.ok) {
            throw new Error("Failed to delete task");
        }

        tasks.splice(index, 1);
        saveTasks();
        displayTasks();

        console.log("Task deleted from backend successfully!");

    } catch (error) {
        console.error("Error deleting task:", error);
        alert("Could not delete task from the backend.");
    }
});


        li.appendChild(checkbox);
        li.appendChild(taskLabel);
        li.appendChild(deleteButton);

        taskList.appendChild(li);
    });

    updateProgress();
}


async function addTask() {
    const taskInput = document.getElementById("taskInput");
    const taskText = taskInput.value.trim();

    if (taskText === "") {
        alert("Please enter a study task!");
        return;
    }

    try {
        
const response = await fetch("http://localhost:8080/api/tasks", {
    method: "POST",
    credentials: "include",
    headers: {
        "Content-Type": "application/json"
    },

            body: JSON.stringify({
                title: taskText
            })
        });

        if (!response.ok) {
            throw new Error("Failed to add study task");
        }

        const newTask = await response.json();

        console.log("Task added to backend:", newTask);

        tasks.push({
    id: newTask.id,
    text: newTask.title,
    completed: newTask.completed
});

        saveTasks();
        displayTasks();

        taskInput.value = "";
        taskInput.focus();

    } catch (error) {
        console.error("Error adding task:", error);
        alert("Could not add task to the backend. Please check that Spring Boot is running.");
    }
}


function displayDsaProblems() {
    const dsaList = document.getElementById("dsaList");
    dsaList.innerHTML = "";

    dsaProblems.forEach(function (problem, index) {
        const li = document.createElement("li");

        const solvedCheckbox = document.createElement("input");
        solvedCheckbox.type = "checkbox";
        solvedCheckbox.checked = problem.solved;

        const problemInfo = document.createElement("span");
        problemInfo.textContent =
            problem.name + " (" + problem.difficulty + ")";
        problemInfo.className = "task-text";

        if (problem.solved) {
            problemInfo.style.textDecoration = "line-through";
        }

        solvedCheckbox.addEventListener("change", async function () {
            const previousStatus = problem.solved;
            const newStatus = solvedCheckbox.checked;

            try {
                const response = await fetch(
                    `http://localhost:8080/api/dsa/${problem.id}`,
                    {
    method: "PUT",
    credentials: "include",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        solved: newStatus
    })
}
                );

                if (!response.ok) {
                    throw new Error("Failed to update DSA problem");
                }

                dsaProblems[index].solved = newStatus;
                displayDsaProblems();

            } catch (error) {
                console.error("Error updating DSA problem:", error);
                solvedCheckbox.checked = previousStatus;
                alert("Could not update the DSA problem in the database.");
            }
        });

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-button";

        deleteButton.addEventListener("click", async function () {
            try {
                const response = await fetch(
                    `http://localhost:8080/api/dsa/${problem.id}`,
                    {
    method: "DELETE",
    credentials: "include"
}
                );

                if (!response.ok) {
                    throw new Error("Failed to delete DSA problem");
                }

                dsaProblems.splice(index, 1);
                displayDsaProblems();

            } catch (error) {
                console.error("Error deleting DSA problem:", error);
                alert("Could not delete the DSA problem from the database.");
            }
        });

        li.appendChild(solvedCheckbox);
        li.appendChild(problemInfo);
        li.appendChild(deleteButton);

        dsaList.appendChild(li);
    });

    updateProgress();
}



async function addDsaProblem() {
    const input = document.getElementById("dsaInput");
    const difficulty = document.getElementById("dsaDifficulty");
    const name = input.value.trim();

    if (name === "") {
        alert("Please enter a problem name!");
        return;
    }

    try {
        const response = await fetch("http://localhost:8080/api/dsa", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
        name: name,
        difficulty: difficulty.value,
        solved: false
    })
});

        if (!response.ok) {
            throw new Error("Failed to add DSA problem");
        }

        const newProblem = await response.json();

        dsaProblems.push({
            id: newProblem.id,
            name: newProblem.name,
            difficulty: newProblem.difficulty,
            solved: newProblem.solved
        });

        displayDsaProblems();

        input.value = "";
        input.focus();

        console.log("DSA problem saved to MySQL:", newProblem);

    } catch (error) {
        console.error("Error adding DSA problem:", error);
        alert("Could not save the DSA problem. Please check that Spring Boot is running.");
    }
}


function displayInterviewTopics() {
    const interviewList = document.getElementById("interviewList");
    interviewList.innerHTML = "";

    interviewTopics.forEach(function (topic, index) {
        const li = document.createElement("li");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = topic.completed;

        const topicLabel = document.createElement("span");
        topicLabel.className = "task-text";
        topicLabel.textContent = topic.subject + ": " + topic.name;

        if (topic.completed) {
            topicLabel.style.textDecoration = "line-through";
        }

        
checkbox.addEventListener("change", async function () {
    const topic = interviewTopics[index];

    try {
        const response = await fetch(
            `http://localhost:8080/api/interview-topics/${topic.id}`,
            {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    completed: checkbox.checked
                })
            }
        );

        if (!response.ok) {
            throw new Error("Failed to update topic");
        }

        topic.completed = checkbox.checked;
        displayInterviewTopics();
    } catch (error) {
        alert("Could not update topic. Please try again.");
        checkbox.checked = topic.completed;
        console.error(error);
    }
});


        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-button";

        
deleteButton.addEventListener("click", async function () {
    const topic = interviewTopics[index];

    try {
        const response = await fetch(
            `http://localhost:8080/api/interview-topics/${topic.id}`,
            {
    method: "DELETE",
    credentials: "include"
}
        );

        if (!response.ok) {
            throw new Error("Failed to delete topic");
        }

        interviewTopics.splice(index, 1);
        displayInterviewTopics();
    } catch (error) {
        alert("Could not delete topic. Please try again.");
        console.error(error);
    }
});


        li.appendChild(checkbox);
        li.appendChild(topicLabel);
        li.appendChild(deleteButton);

        interviewList.appendChild(li);
    });

    updateProgress();
}


async function addInterviewTopic() {
    const subject = document.getElementById("interviewSubject").value;
    const topicInput = document.getElementById("interviewTopic");
    const name = topicInput.value.trim();

    if (name === "") {
        alert("Please enter an interview topic!");
        return;
    }

    try {
        const response = await fetch(
            "http://localhost:8080/api/interview-topics",
            {
                
method: "POST",
credentials: "include",
headers: {
    "Content-Type": "application/json"
},
body: JSON.stringify({

                    subject: subject,
                    name: name,
                    completed: false
                })
            }
        );

        if (!response.ok) {
            throw new Error("Failed to add interview topic");
        }

        const savedTopic = await response.json();
        interviewTopics.push(savedTopic);

        displayInterviewTopics();

        topicInput.value = "";
        topicInput.focus();
    } catch (error) {
        alert("Could not add topic. Please check whether the backend is running.");
        console.error(error);
    }
}

function updateProgress() {
    const totalTasks = tasks.length;

    const completedTasks = tasks.filter(function (task) {
        return task.completed;
    }).length;

    const totalDsa = dsaProblems.length;

    const solvedDsa = dsaProblems.filter(function (problem) {
        return problem.solved;
    }).length;

    const totalInterview = interviewTopics.length;

    const completedInterview = interviewTopics.filter(function (topic) {
        return topic.completed;
    }).length;

    document.getElementById("totalTasks").textContent = totalTasks;
    document.getElementById("completedTasks").textContent = completedTasks;
    document.getElementById("totalDsa").textContent = totalDsa;
    document.getElementById("solvedDsa").textContent = solvedDsa;
    
document.getElementById("totalInterview").textContent = totalInterview;
document.getElementById("completedInterview").textContent = completedInterview;

    const totalItems = totalTasks + totalDsa + totalInterview;

    const completedItems =
        completedTasks + solvedDsa + completedInterview;

    const percentage = totalItems === 0
        ? 0
        : Math.round((completedItems / totalItems) * 100);

    document.getElementById("progressFill").style.width =
        percentage + "%";

    document.getElementById("progressText").textContent =
        percentage + "% completed";
}




displayTasks();
displayDsaProblems();
displayInterviewTopics();
updateProgress();

/* =========================
   JAVA INTERVIEW QUESTIONS
========================= */

/* Save reviewed Java questions */
let reviewedQuestions = JSON.parse(
    localStorage.getItem("reviewedJavaQuestions")
) || [];

function saveReviewedQuestions() {
    localStorage.setItem(
        "reviewedJavaQuestions",
        JSON.stringify(reviewedQuestions)
    );
}

const javaQuestions = [
    {
        topic: "Core Java",
        question: "What is Java?",
        answer: "Java is a high-level, class-based programming language. It is platform-independent because Java code compiles into bytecode, which runs on a Java Virtual Machine (JVM)."
    },
    {
        topic: "Core Java",
        question: "What is the difference between JDK, JRE, and JVM?",
        answer: "JVM executes Java bytecode. JRE provides the JVM and runtime libraries needed to run Java applications. JDK includes development tools such as the compiler, along with the runtime components."
    },
    {
        topic: "Core Java",
        question: "Why is Java platform-independent?",
        answer: "The Java compiler converts source code into bytecode. A compatible JVM on each operating system can execute that bytecode."
    },
    {
        topic: "OOP",
        question: "What are the four pillars of OOP?",
        answer: "The four pillars are Encapsulation, Inheritance, Polymorphism, and Abstraction."
    },
    {
        topic: "OOP",
        question: "What is inheritance in Java?",
        answer: "Inheritance allows a class to acquire accessible fields and methods from another class using the extends keyword. It supports code reuse."
    },
    {
        topic: "OOP",
        question: "What is polymorphism?",
        answer: "Polymorphism means one interface or parent type can represent different implementations. In Java, method overloading is compile-time polymorphism, while method overriding supports runtime polymorphism."
    },
    {
        topic: "Strings",
        question: "Why is String immutable in Java?",
        answer: "A String object cannot be changed after it is created. Immutability helps with security, thread safety, string pooling, and reliable use as a map key."
    },
    {
        topic: "Strings",
        question: "What is the difference between == and equals()?",
        answer: "For objects, == compares references, while equals() compares logical content when the class implements it that way. String.equals() compares character content."
    },
    {
        topic: "Collections",
        question: "What is the Java Collections Framework?",
        answer: "It is a set of interfaces and classes for storing and manipulating groups of objects. Examples include List, Set, Queue, and Map."
    },
    {
        topic: "Collections",
        question: "What is the difference between ArrayList and LinkedList?",
        answer: "ArrayList uses a resizable array and generally provides fast indexed access. LinkedList uses linked nodes; insertion or removal at a known node can be efficient, but indexed access is slower."
    }
];


/* Display Java Questions */

function displayJavaQuestions() {
    const questionList = document.getElementById("questionList");
    const searchInput = document.getElementById("questionSearch");
    const topicSelect = document.getElementById("questionTopic");

    if (!questionList || !searchInput || !topicSelect) {
        return;
    }

    const searchText = searchInput.value.toLowerCase().trim();
    const selectedTopic = topicSelect.value;

    questionList.innerHTML = "";

    const filteredQuestions = javaQuestions.filter(function (item) {
        const matchesSearch =
            item.question.toLowerCase().includes(searchText) ||
            item.answer.toLowerCase().includes(searchText);

        const matchesTopic =
            selectedTopic === "All" || item.topic === selectedTopic;

        return matchesSearch && matchesTopic;
    });

    if (filteredQuestions.length === 0) {
        questionList.textContent = "No matching questions found.";
        return;
    }

    filteredQuestions.forEach(function (item) {
        const card = document.createElement("div");
        card.className = "question-card";

        const topic = document.createElement("p");
        topic.className = "question-topic";
        topic.textContent = item.topic;

        const question = document.createElement("h3");
        question.textContent = item.question;

        const answer = document.createElement("p");
        answer.className = "question-answer";
        answer.textContent = item.answer;
        answer.hidden = true;

        const button = document.createElement("button");
        button.textContent = "Show Answer";

        button.addEventListener("click", function () {
            answer.hidden = !answer.hidden;
            button.textContent = answer.hidden
                ? "Show Answer"
                : "Hide Answer";
        });

        
const questionId = item.topic + ":" + item.question;

const reviewButton = document.createElement("button");
const isReviewed = reviewedQuestions.includes(questionId);

reviewButton.textContent = isReviewed
    ? "✓ Reviewed"
    : "Mark as Reviewed";

reviewButton.style.marginLeft = "8px";

if (isReviewed) {
    reviewButton.style.background = "#16a34a";
}

reviewButton.addEventListener("click", function () {
    if (reviewedQuestions.includes(questionId)) {
        reviewedQuestions = reviewedQuestions.filter(function (id) {
            return id !== questionId;
        });
    } else {
        reviewedQuestions.push(questionId);
    }

    saveReviewedQuestions();
    displayJavaQuestions();
});

card.appendChild(topic);
card.appendChild(question);
card.appendChild(button);
card.appendChild(reviewButton);
card.appendChild(answer);


        questionList.appendChild(card);
    });

    // Update Java revision progress
    const totalQuestions = javaQuestions.length;
    const reviewedCount = reviewedQuestions.length;

    const reviewPercentage = totalQuestions === 0
        ? 0
        : Math.round((reviewedCount / totalQuestions) * 100);

    document.getElementById("reviewedCount").textContent =
        reviewedCount + " / " + totalQuestions + " reviewed";

    document.getElementById("reviewProgressFill").style.width =
        reviewPercentage + "%";

    document.getElementById("reviewProgressText").textContent =
        reviewPercentage + "% reviewed";
}



/* Search and Topic Filter */

document.getElementById("questionSearch").addEventListener(
    "input",
    displayJavaQuestions
);

document.getElementById("questionTopic").addEventListener(
    "change",
    displayJavaQuestions
);


/* Load Questions */

displayJavaQuestions();
// Test connection with Spring Boot

 // Connect StudyHub to the Spring Boot backend

async function loadTasksFromBackend() {
    try {
        
const response = await fetch("http://localhost:8080/api/tasks", {
    credentials: "include"
});


        if (!response.ok) {
            throw new Error("Failed to load study tasks");
        }

        const backendTasks = await response.json();

        // Convert backend tasks to the format used by StudyHub
        tasks = backendTasks.map(task => ({
    id: task.id,
    text: task.title,
    completed: task.completed
}));

        // Display the tasks on the webpage
        saveTasks();
        displayTasks();

        console.log("Study tasks loaded successfully!");
        console.table(backendTasks);

    } catch (error) {
        console.error("Backend connection failed:", error);
    }
}

async function loadDsaProblemsFromBackend() {
    try {
        const response = await fetch("http://localhost:8080/api/dsa", {
    credentials: "include"
});

        if (!response.ok) {
            throw new Error("Failed to load DSA problems");
        }

        const backendProblems = await response.json();

        dsaProblems = backendProblems.map(function (problem) {
            return {
                id: problem.id,
                name: problem.name,
                difficulty: problem.difficulty,
                solved: problem.solved
            };
        });

        displayDsaProblems();

        console.log("DSA problems loaded successfully!");
        console.table(backendProblems);

    } catch (error) {
        console.error("Failed to load DSA problems:", error);
        alert("Could not load DSA problems. Please check that Spring Boot is running.");
    }
}


async function loadInterviewTopicsFromBackend() {
    try {
        const response = await fetch("http://localhost:8080/api/interview-topics", {
    credentials: "include"
});

        if (!response.ok) {
            throw new Error("Failed to load interview topics");
        }

        interviewTopics = await response.json();
        displayInterviewTopics();
    } catch (error) {
        console.error("Error loading interview topics:", error);
        alert("Could not load interview topics. Please check the backend.");
    }
}


/* =========================
   STUDYHUB AUTHENTICATION
========================= */

const API_BASE = "http://localhost:8080";

document.getElementById("registerForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const message = document.getElementById("registerMessage");
    message.textContent = "Registering...";

    try {
        const response = await fetch(`${API_BASE}/api/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: document.getElementById("registerName").value.trim(),
                email: document.getElementById("registerEmail").value.trim(),
                password: document.getElementById("registerPassword").value
            })
        });

        const result = await response.text();

        if (!response.ok) {
            throw new Error(result || "Registration failed.");
        }

        message.textContent = result + " You can now log in.";
        document.getElementById("registerForm").reset();

    } catch (error) {
        message.textContent = error.message;
    }
});

document.getElementById("loginForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const message = document.getElementById("loginMessage");
    message.textContent = "Logging in...";

    try {
        const response = await fetch(`${API_BASE}/api/auth/login`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: document.getElementById("loginEmail").value.trim(),
                password: document.getElementById("loginPassword").value
            })
        });

        const result = await response.text();

        if (!response.ok) {
            throw new Error(result || "Login failed.");
        }

        message.textContent = result;

        document.getElementById("auth-section").hidden = true;
        document.getElementById("app-dashboard").hidden = false;

        document.getElementById("userStatus").textContent =
            "Logged in as " + document.getElementById("loginEmail").value.trim();

        document.getElementById("loginForm").reset();

        await loadTasksFromBackend();
        await loadDsaProblemsFromBackend();
        await loadInterviewTopicsFromBackend();

    } catch (error) {
        message.textContent = error.message;
    }
});


document.getElementById("logoutButton").addEventListener("click", async function () {
    try {
        const response = await fetch(`${API_BASE}/api/auth/logout`, {
            method: "POST",
            credentials: "include"
        });

        const result = await response.text();

        if (!response.ok) {
            throw new Error(result || "Logout failed.");
        }

        document.getElementById("auth-section").hidden = false;
        document.getElementById("app-dashboard").hidden = true;

        document.getElementById("userStatus").textContent = "";
        alert("Logged out successfully!");

    } catch (error) {
        console.error("Logout error:", error);
        alert("Could not log out. Please try again.");
    }
});

