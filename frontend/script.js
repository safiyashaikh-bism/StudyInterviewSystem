

let csrfToken = "";

async function initializeCsrfToken() {
    const response = await fetch(`${API_BASE}/api/csrf`, {
        method: "GET",
        credentials: "include"
    });

    if (!response.ok) {
        throw new Error("Failed to initialize CSRF token");
    }

    const data = await response.json();

    // Read the CSRF token from the XSRF-TOKEN cookie
    const cookies = document.cookie.split("; ");

    const csrfCookie = cookies.find(cookie =>
        cookie.startsWith("XSRF-TOKEN=")
    );

    if (csrfCookie) {
        csrfToken = decodeURIComponent(
            csrfCookie.substring("XSRF-TOKEN=".length)
        );
    } else {
        csrfToken = data.token;
    }
}

function getCsrfToken() {
    return csrfToken;
}


let tasks = JSON.parse(localStorage.getItem("studyTasks")) || [];

let dsaProblems = [];
let javaPracticeProblems = [];
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
            "Content-Type": "application/json",
            "X-XSRF-TOKEN": getCsrfToken()
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
        credentials: "include",
        headers: {
            "X-XSRF-TOKEN": getCsrfToken()
        }
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
        "Content-Type": "application/json",
        "X-XSRF-TOKEN": getCsrfToken()
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
            "Content-Type": "application/json",
            "X-XSRF-TOKEN": getCsrfToken()
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
        credentials: "include",
        headers: {
            "X-XSRF-TOKEN": getCsrfToken()
        }
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



function displayJavaPracticeProblems() {
    const list = document.getElementById("javaPracticeList");
    list.innerHTML = "";

    javaPracticeProblems.forEach(function (problem) {
        const li = document.createElement("li");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = problem.solved;

        checkbox.addEventListener("change", function () {
            updateJavaPracticeStatus(problem.id, checkbox.checked);
        });

        const text = document.createElement("span");
        text.textContent =
            problem.name + " (" + problem.difficulty + ")";

        if (problem.solved) {
            text.style.textDecoration = "line-through";
        }

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", function () {
            deleteJavaPracticeProblem(problem.id);
        });

        li.appendChild(checkbox);
        li.appendChild(text);
        li.appendChild(deleteButton);

        list.appendChild(li);
    });
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
    headers: {
        "Content-Type": "application/json",
        "X-XSRF-TOKEN": getCsrfToken()
    },
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


async function addJavaPractice() {
    const input = document.getElementById("javaPracticeInput");
    const difficulty = document.getElementById("javaPracticeDifficulty");
    const name = input.value.trim();

    if (name === "") {
        alert("Please enter a Java question!");
        return;
    }

    try {
        const response = await fetch(
            "http://localhost:8080/api/java-practice",
            {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    "X-XSRF-TOKEN": getCsrfToken()
                },
                body: JSON.stringify({
                    name: name,
                    difficulty: difficulty.value,
                    solved: false
                })
            }
        );

        if (!response.ok) {
            throw new Error("Failed to add Java Practice question");
        }

        const newProblem = await response.json();

        javaPracticeProblems.push(newProblem);
        displayJavaPracticeProblems();
        updateProgress();

        input.value = "";
        input.focus();

        console.log("Java Practice question saved:", newProblem);

    } catch (error) {
        console.error("Error adding Java Practice question:", error);
        alert("Could not save the Java Practice question. Please check that Spring Boot is running.");
    }
}

async function updateJavaPracticeStatus(id, solved) {
    try {
        const response = await fetch(
            "http://localhost:8080/api/java-practice/" + id,
            {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    "X-XSRF-TOKEN": getCsrfToken()
                },
                body: JSON.stringify({
                    solved: solved
                })
            }
        );

        if (!response.ok) {
            throw new Error("Failed to update Java Practice status");
        }

        const problem = javaPracticeProblems.find(function (item) {
            return item.id === id;
        });

        if (problem) {
            problem.solved = solved;
        }

        displayJavaPracticeProblems();
        updateProgress();

    } catch (error) {
        console.error("Error updating Java Practice status:", error);
        alert("Could not update the solved status. Please try again.");
        await loadJavaPracticeFromBackend();
    }
}

async function deleteJavaPracticeProblem(id) {
    const confirmed = confirm(
        "Are you sure you want to delete this Java question?"
    );

    if (!confirmed) {
        return;
    }

    try {
        const response = await fetch(
            "http://localhost:8080/api/java-practice/" + id,
            {
                method: "DELETE",
                credentials: "include",
                headers: {
                    "X-XSRF-TOKEN": getCsrfToken()
                }
            }
        );

        if (!response.ok) {
            throw new Error("Failed to delete Java Practice question");
        }

        javaPracticeProblems = javaPracticeProblems.filter(
            function (problem) {
                return problem.id !== id;
            }
        );

        displayJavaPracticeProblems();
        updateProgress();

    } catch (error) {
        console.error("Error deleting Java Practice question:", error);
        alert("Could not delete the Java Practice question. Please try again.");
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
            "Content-Type": "application/json",
            "X-XSRF-TOKEN": getCsrfToken()
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
        credentials: "include",
        headers: {
            "X-XSRF-TOKEN": getCsrfToken()
        }
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
            "Content-Type": "application/json",
            "X-XSRF-TOKEN": getCsrfToken()
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
    const totalJavaPractice = javaPracticeProblems.length;

const solvedJavaPractice = javaPracticeProblems.filter(function (problem) {
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
const taskPercentage = totalTasks === 0
    ? 0
    : Math.round((completedTasks / totalTasks) * 100);

const dsaPercentage = totalDsa === 0
    ? 0
    : Math.round((solvedDsa / totalDsa) * 100);

const interviewPercentage = totalInterview === 0
    ? 0
    : Math.round((completedInterview / totalInterview) * 100);

const javaPracticePercentage = totalJavaPractice === 0
    ? 0
    : Math.round((solvedJavaPractice / totalJavaPractice) * 100);

document.getElementById("tasksProgressText").textContent =
    taskPercentage + "%";

document.getElementById("dsaProgressText").textContent =
    dsaPercentage + "%";

document.getElementById("interviewProgressText").textContent =
    interviewPercentage + "%";
    const totalItems =
    totalTasks + totalDsa + totalJavaPractice + totalInterview;

document.getElementById("javaPracticeProgressText").textContent =
    javaPracticePercentage + "%";

const completedItems =
    completedTasks + solvedDsa + solvedJavaPractice + completedInterview;

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

let reviewedQuestions = [];

async function loadReviewedQuestionsFromBackend() {
    const response = await fetch(
        `${API_BASE}/api/java-question-progress`,
        {
            method: "GET",
            credentials: "include"
        }
    );

    if (!response.ok) {
        throw new Error("Failed to load Java revision progress");
    }

    const progress = await response.json();

    reviewedQuestions = progress
        .filter(item => item.reviewed)
        .map(item => item.questionKey);

    displayJavaQuestions();
}

async function saveReviewedQuestion(questionKey, reviewed) {
    const response = await fetch(
        `${API_BASE}/api/java-question-progress/${encodeURIComponent(questionKey)}`,
        {
            method: "PUT",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "X-XSRF-TOKEN": getCsrfToken()
            },
            body: JSON.stringify({ reviewed })
        }
    );

    if (!response.ok) {
        throw new Error("Failed to save Java revision progress");
    }
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


reviewButton.addEventListener("click", async function () {
    const wasReviewed = reviewedQuestions.includes(questionId);
    const newReviewedStatus = !wasReviewed;

    reviewButton.disabled = true;

    try {
        await saveReviewedQuestion(questionId, newReviewedStatus);

        if (newReviewedStatus) {
            reviewedQuestions.push(questionId);
        } else {
            reviewedQuestions = reviewedQuestions.filter(function (id) {
                return id !== questionId;
            });
        }

        displayJavaQuestions();
    } catch (error) {
        console.error("Error saving Java review progress:", error);
        alert("Could not save your review progress. Please try again.");
    } finally {
        reviewButton.disabled = false;
    }
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

async function loadJavaPracticeFromBackend() {
    try {
        const response = await fetch(
            "http://localhost:8080/api/java-practice",
            {
                credentials: "include"
            }
        );

        if (!response.ok) {
            throw new Error("Failed to load Java Practice questions");
        }

        javaPracticeProblems = await response.json();

        displayJavaPracticeProblems();

        console.log("Java Practice questions loaded successfully!");

    } catch (error) {
        console.error("Failed to load Java Practice questions:", error);
        alert("Could not load Java Practice questions. Please check that Spring Boot is running.");
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

const csrfReady = initializeCsrfToken();


document.getElementById("registerForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const message = document.getElementById("registerMessage");
    message.textContent = "Registering...";

    try {
        await csrfReady;
const response = await fetch(`${API_BASE}/api/auth/register`, {
    method: "POST",
    credentials: "include",
    headers: {
        "Content-Type": "application/json",
        "X-XSRF-TOKEN": getCsrfToken()
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
        await csrfReady;
const response = await fetch(`${API_BASE}/api/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: {
        "Content-Type": "application/json",
        "X-XSRF-TOKEN": getCsrfToken()
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
        await initializeCsrfToken();
        await loadReviewedQuestionsFromBackend();
        document.getElementById("auth-section").hidden = true;
        document.getElementById("app-dashboard").hidden = false;

        document.getElementById("userStatus").textContent =
            "Logged in as " + document.getElementById("loginEmail").value.trim();

        document.getElementById("loginForm").reset();

        await loadTasksFromBackend();
await loadDsaProblemsFromBackend();
await loadInterviewTopicsFromBackend();
await loadJavaPracticeFromBackend();

    } catch (error) {
        message.textContent = error.message;
    }
});


document.getElementById("logoutButton").addEventListener("click", async function () {
    try {
        await csrfReady;
const response = await fetch(`${API_BASE}/api/auth/logout`, {
    method: "POST",
    credentials: "include",
    headers: {
        "X-XSRF-TOKEN": getCsrfToken()
    }
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


const javaQuizQuestions = [
    {
        topic: "OOP",
        question: "Which concept allows a class to inherit properties from another class?",
        options: ["Encapsulation", "Inheritance", "Polymorphism", "Abstraction"],
        answer: 1,
        explanation: "Inheritance allows a class to acquire properties and methods from another class."
    },
    {
        topic: "OOP",
        question: "Which keyword is used to create an object in Java?",
        options: ["class", "this", "new", "static"],
        answer: 2,
        explanation: "The new keyword creates an object and allocates memory for it."
    },
    {
        topic: "Strings",
        question: "Which method compares the contents of two Java strings?",
        options: ["==", "compare()", "equals()", "same()"],
        answer: 2,
        explanation: "equals() compares string contents, while == compares object references."
    },
    {
        topic: "Strings",
        question: "Which class creates a mutable sequence of characters?",
        options: ["String", "StringBuilder", "Character", "Scanner"],
        answer: 1,
        explanation: "StringBuilder allows strings to be modified without creating a new object for every change."
    },
    {
        topic: "Collections",
        question: "Which collection stores unique elements?",
        options: ["ArrayList", "LinkedList", "HashSet", "Array"],
        answer: 2,
        explanation: "HashSet stores unique elements and does not guarantee their iteration order."
    },
    {
        topic: "Collections",
        question: "Which interface represents key-value mappings in Java?",
        options: ["List", "Queue", "Set", "Map"],
        answer: 3,
        explanation: "Map stores entries as key-value pairs, with unique keys."
    },
    {
        topic: "Exceptions",
        question: "Which block normally executes whether an exception occurs or not?",
        options: ["try", "catch", "finally", "throw"],
        answer: 2,
        explanation: "The finally block normally executes whether an exception occurs or not."
    },
    {
        topic: "Exceptions",
        question: "Which keyword explicitly throws an exception?",
        options: ["throws", "throw", "try", "catch"],
        answer: 1,
        explanation: "throw is used to explicitly throw an exception. throws declares possible exceptions in a method signature."
    }
];

let activeJavaQuizQuestions = [];
let javaQuizIndex = 0;
let javaQuizScore = 0;
let javaQuizAnswered = false;

function startJavaQuiz() {
    const topic = document.getElementById("javaQuizTopic").value;

    activeJavaQuizQuestions = topic === "All"
        ? [...javaQuizQuestions]
        : javaQuizQuestions.filter(function (question) {
            return question.topic === topic;
        });

    if (activeJavaQuizQuestions.length === 0) {
        alert("No questions available for this topic.");
        return;
    }

    javaQuizIndex = 0;
    javaQuizScore = 0;
    javaQuizAnswered = false;

    document.getElementById("javaQuizArea").hidden = false;
    document.getElementById("javaQuizResult").hidden = true;
    document.getElementById("startJavaQuizButton").textContent = "Restart Quiz";

    showJavaQuizQuestion();
}

function showJavaQuizQuestion() {
    const question = activeJavaQuizQuestions[javaQuizIndex];

    javaQuizAnswered = false;

    document.getElementById("javaQuizQuestion").textContent =
        "Question " + (javaQuizIndex + 1) + " of " +
        activeJavaQuizQuestions.length + ": " + question.question;

    const optionsArea = document.getElementById("javaQuizOptions");
    optionsArea.innerHTML = "";

    question.options.forEach(function (option, index) {
        const button = document.createElement("button");
        button.textContent = option;
        button.style.display = "block";
        button.style.margin = "8px 0";
        button.addEventListener("click", function () {
            selectJavaQuizAnswer(index);
        });
        optionsArea.appendChild(button);
    });

    document.getElementById("nextJavaQuizButton").hidden = true;
}

function selectJavaQuizAnswer(selectedIndex) {
    if (javaQuizAnswered) {
        return;
    }

    javaQuizAnswered = true;

    const question = activeJavaQuizQuestions[javaQuizIndex];
    const buttons = document.getElementById("javaQuizOptions").querySelectorAll("button");

    if (selectedIndex === question.answer) {
        javaQuizScore++;
    }

    buttons.forEach(function (button, index) {
        button.disabled = true;

        if (index === question.answer) {
            button.textContent += " ✓ Correct answer";
        } else if (index === selectedIndex) {
            button.textContent += " ✗ Your answer";
        }
    });

    const result = document.getElementById("javaQuizResult");
    result.hidden = false;
    result.textContent = question.explanation;

    const nextButton = document.getElementById("nextJavaQuizButton");
    nextButton.hidden = false;
    nextButton.textContent =
        javaQuizIndex === activeJavaQuizQuestions.length - 1
            ? "See Final Score"
            : "Next Question";
}


async function nextJavaQuizQuestion() {
    if (!javaQuizAnswered) {
        return;
    }

    if (javaQuizIndex < activeJavaQuizQuestions.length - 1) {
        javaQuizIndex++;
        document.getElementById("javaQuizResult").hidden = true;
        showJavaQuizQuestion();
    } else {
        const totalQuestions = activeJavaQuizQuestions.length;

        document.getElementById("javaQuizQuestion").textContent =
            "Quiz completed! You scored " + javaQuizScore + " out of " +
            totalQuestions + ".";

        document.getElementById("javaQuizOptions").innerHTML = "";
        document.getElementById("javaQuizResult").hidden = true;
        document.getElementById("nextJavaQuizButton").hidden = true;

        const topic = document.getElementById("javaQuizTopic").value;

        try {
            const response = await fetch(
                "http://localhost:8080/api/java-quiz-results",
                {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                        "X-XSRF-TOKEN": getCsrfToken()
                    },
                    body: JSON.stringify({
                        score: javaQuizScore,
                        totalQuestions: totalQuestions,
                        topic: topic
                    })
                }
            );

            if (!response.ok) {
                throw new Error("Could not save quiz result.");
            }

            document.getElementById("javaQuizQuestion").textContent +=
                " Result saved successfully!";
        } catch (error) {
            console.error("Quiz result save error:", error);
            alert(
                "Your quiz is complete, but the result could not be saved. " +
                "Please check that you are logged in and the backend is running."
            );
        }
    }
}


async function loadJavaQuizHistory() {
    const historyList = document.getElementById("javaQuizHistoryList");
    const message = document.getElementById("javaQuizHistoryMessage");

    historyList.innerHTML = "";
    message.textContent = "Loading quiz history...";

    try {
        const response = await fetch(
            "http://localhost:8080/api/java-quiz-results",
            {
                method: "GET",
                credentials: "include"
            }
        );

        if (!response.ok) {
            throw new Error("Could not load quiz history.");
        }

        const results = await response.json();

        if (results.length === 0) {
            message.textContent = "You haven't completed any quizzes yet.";
            return;
        }

        message.textContent = "";

        results.sort(function (a, b) {
            return new Date(b.attemptedAt) - new Date(a.attemptedAt);
        });

        results.forEach(function (result) {
            const item = document.createElement("li");

            const date = result.attemptedAt
                ? new Date(result.attemptedAt).toLocaleString()
                : "Date unavailable";

            item.textContent =
                result.topic + " — Score: " +
                result.score + "/" + result.totalQuestions +
                " — " + date;

            historyList.appendChild(item);
        });
    } catch (error) {
        console.error("Quiz history error:", error);
        message.textContent =
            "Unable to load quiz history. Please log in and try again.";
    }
}

async function loadJavaQuizAnalytics() {
    const content = document.getElementById("javaQuizAnalyticsContent");
    const message = document.getElementById("javaQuizAnalyticsMessage");

    message.textContent = "Loading performance analytics...";
    content.hidden = true;

    try {
        const response = await fetch(
            "http://localhost:8080/api/java-quiz-results",
            {
                method: "GET",
                credentials: "include"
            }
        );

        if (!response.ok) {
            throw new Error("Could not load quiz results.");
        }

        const results = await response.json();

        if (results.length === 0) {
            message.textContent = "Complete a Java quiz to see your analytics.";
            return;
        }

        const totalAttempts = results.length;
        let totalQuestions = 0;
        let totalCorrect = 0;
        let bestScore = 0;
        const topicStats = {};

        results.forEach(function (result) {
            const score = Number(result.score);
            const total = Number(result.totalQuestions);
            const topic = result.topic || "Unknown";

            totalCorrect += score;
            totalQuestions += total;
            bestScore = Math.max(bestScore, score);

            if (!topicStats[topic]) {
                topicStats[topic] = {
                    correct: 0,
                    questions: 0,
                    attempts: 0
                };
            }

            topicStats[topic].correct += score;
            topicStats[topic].questions += total;
            topicStats[topic].attempts++;
        });

        const accuracy = totalQuestions > 0
            ? Math.round((totalCorrect / totalQuestions) * 100)
            : 0;

        document.getElementById("javaQuizTotalAttempts").textContent =
            "Total quiz attempts: " + totalAttempts;

        document.getElementById("javaQuizOverallAccuracy").textContent =
            "Overall accuracy: " + accuracy + "%";

        document.getElementById("javaQuizBestScore").textContent =
            "Best score: " + bestScore + " correct answers in one quiz";

        const topicList = document.getElementById("javaQuizTopicPerformance");
        topicList.innerHTML = "";

        Object.keys(topicStats).forEach(function (topic) {
            const stats = topicStats[topic];
            const topicAccuracy = stats.questions > 0
                ? Math.round((stats.correct / stats.questions) * 100)
                : 0;

            const item = document.createElement("li");
            item.textContent =
                topic + ": " + topicAccuracy + "% accuracy (" +
                stats.attempts + " attempt(s))";

            topicList.appendChild(item);
        });

        content.hidden = false;
        message.textContent = "";
    } catch (error) {
        console.error("Quiz analytics error:", error);
        message.textContent =
            "Unable to load analytics. Please log in and try again.";
    }
}


const javaCodingProblems = {
    reverse: {
        title: "Reverse a String",
        statement: "Write a Java program that reverses the given string.",
        sampleInput: "hello",
        sampleOutput: "olleh",
        template: `public class Main {
    public static void main(String[] args) {
        String str = "hello";

        // Write your logic here

        System.out.println(str);
    }
}`
    },
    palindrome: {
        title: "Check Palindrome",
        statement: "Check whether a string reads the same forward and backward. Ignore letter case.",
        sampleInput: "Madam",
        sampleOutput: "Palindrome",
        template: `public class Main {
    public static void main(String[] args) {
        String str = "Madam";

        // Write your logic here

    }
}`
    },
    largest: {
        title: "Find Largest Element",
        statement: "Find the largest number in an integer array.",
        sampleInput: "[4, 9, 2, 7]",
        sampleOutput: "9",
        template: `public class Main {
    public static void main(String[] args) {
        int[] arr = {4, 9, 2, 7};

        // Write your logic here

    }
}`
    }
};


function openJavaCodingProblem() {
    const selectedProblem =
        document.getElementById("javaCodingProblemSelect").value;

    const problem = javaCodingProblems[selectedProblem];

    if (!problem) {
        alert("Please select a valid coding problem.");
        return;
    }

    document.getElementById("javaCodingProblemTitle").textContent =
        problem.title;

    document.getElementById("javaCodingProblemStatement").textContent =
        problem.statement;

    document.getElementById("javaCodingSampleInput").textContent =
        problem.sampleInput;

    document.getElementById("javaCodingSampleOutput").textContent =
        problem.sampleOutput;

    document.getElementById("javaCodingProblemDetails").hidden = false;
    document.getElementById("javaCodingCode").value = problem.template;
}

function resetJavaCodingCode() {
    const codeEditor = document.getElementById("javaCodingCode");

    codeEditor.value = "";
    codeEditor.focus();
}

document.getElementById("javaCodingProblemSelect").addEventListener(
    "change",
    function () {
        openJavaCodingProblem();
    }
);


async function runJavaCodingCode() {
    const code = document.getElementById("javaCodingCode").value;
    const outputPanel = document.getElementById("javaCodingOutput");
    const csrfToken = await getCsrfToken();

    outputPanel.textContent = "Running your Java code...";

    try {
        const response = await fetch("http://localhost:8080/api/java-code/run", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-XSRF-TOKEN": csrfToken
            },
            credentials: "include",
            body: JSON.stringify({ code: code })
        });

        const result = await response.json();

        if (!response.ok) {
            outputPanel.textContent =
                result.error || "Unable to execute the code.";
            return;
        }

        outputPanel.textContent =
            result.error || result.output || "Program executed with no output.";

    } catch (error) {
        outputPanel.textContent =
            "Could not connect to the backend. Check whether Spring Boot is running.";
        console.error(error);
    }
}
