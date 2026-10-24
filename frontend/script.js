let tasks = JSON.parse(localStorage.getItem("studyTasks")) || [];

let dsaProblems = JSON.parse(localStorage.getItem("dsaProblems")) || [];

let interviewTopics =
    JSON.parse(localStorage.getItem("interviewTopics")) || [];




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

        checkbox.addEventListener("change", function () {
            tasks[index].completed = checkbox.checked;
            saveTasks();
            displayTasks();
        });

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-button";

        deleteButton.addEventListener("click", function () {
            tasks.splice(index, 1);
            saveTasks();
            displayTasks();
        });

        li.appendChild(checkbox);
        li.appendChild(taskLabel);
        li.appendChild(deleteButton);

        taskList.appendChild(li);
    });

    updateProgress();
}

function addTask() {
    const taskInput = document.getElementById("taskInput");
    const taskText = taskInput.value.trim();

    if (taskText === "") {
        alert("Please enter a study task!");
        return;
    }

    tasks.push({
        text: taskText,
        completed: false
    });

    saveTasks();
    displayTasks();

    taskInput.value = "";
    taskInput.focus();
}




function saveDsaProblems() {
    localStorage.setItem("dsaProblems", JSON.stringify(dsaProblems));
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

        solvedCheckbox.addEventListener("change", function () {
            dsaProblems[index].solved = solvedCheckbox.checked;
            saveDsaProblems();
            displayDsaProblems();
        });

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-button";

        deleteButton.addEventListener("click", function () {
            dsaProblems.splice(index, 1);
            saveDsaProblems();
            displayDsaProblems();
        });

        li.appendChild(solvedCheckbox);
        li.appendChild(problemInfo);
        li.appendChild(deleteButton);

        dsaList.appendChild(li);
    });

    updateProgress();
}

function addDsaProblem() {
    const input = document.getElementById("dsaInput");
    const difficulty = document.getElementById("dsaDifficulty");
    const name = input.value.trim();

    if (name === "") {
        alert("Please enter a problem name!");
        return;
    }

    dsaProblems.push({
        name: name,
        difficulty: difficulty.value,
        solved: false
    });

    saveDsaProblems();
    displayDsaProblems();

    input.value = "";
    input.focus();
}




function saveInterviewTopics() {
    localStorage.setItem(
        "interviewTopics",
        JSON.stringify(interviewTopics)
    );
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

        checkbox.addEventListener("change", function () {
            interviewTopics[index].completed = checkbox.checked;
            saveInterviewTopics();
            displayInterviewTopics();
        });

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-button";

        deleteButton.addEventListener("click", function () {
            interviewTopics.splice(index, 1);
            saveInterviewTopics();
            displayInterviewTopics();
        });

        li.appendChild(checkbox);
        li.appendChild(topicLabel);
        li.appendChild(deleteButton);

        interviewList.appendChild(li);
    });

    updateProgress();
}

function addInterviewTopic() {
    const subject = document.getElementById("interviewSubject").value;
    const topicInput = document.getElementById("interviewTopic");
    const name = topicInput.value.trim();

    if (name === "") {
        alert("Please enter an interview topic!");
        return;
    }

    interviewTopics.push({
        subject: subject,
        name: name,
        completed: false
    });

    saveInterviewTopics();
    displayInterviewTopics();

    topicInput.value = "";
    topicInput.focus();
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
