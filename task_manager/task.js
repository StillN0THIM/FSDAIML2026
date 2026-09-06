let tasks = [];
let currentFilter = "all";
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const pendingTasks = document.getElementById("pendingTasks");
const filterButtons = document.querySelectorAll(".filter-btn");

function loadTasks() {

    const savedTasks = localStorage.getItem("tasks");

    if (savedTasks) {

        tasks = JSON.parse(savedTasks);

    }

}


// ==========================================
// SAVE TASKS
// ==========================================

function saveTasks() {

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );

}


// ==========================================
// ADD TASK
// ==========================================

function addTask() {

    const text = taskInput.value.trim();


    // Don't add empty task
    if (text === "") {

        alert("Please enter a task.");

        return;

    }


    // Create task object
    const newTask = {

        id: Date.now(),

        text: text,

        completed: false

    };


    // Add task to array
    tasks.push(newTask);


    // Save
    saveTasks();


    // Clear input
    taskInput.value = "";


    // Update display
    renderTasks();

}


// ==========================================
// DELETE TASK
// ==========================================

function deleteTask(id) {

    tasks = tasks.filter(function (task) {

        return task.id !== id;

    });


    saveTasks();

    renderTasks();

}


// ==========================================
// COMPLETE / UNCOMPLETE TASK
// ==========================================

function toggleTask(id) {

    tasks.forEach(function (task) {

        if (task.id === id) {

            task.completed = !task.completed;

        }

    });


    saveTasks();

    renderTasks();

}


// ==========================================
// EDIT TASK
// ==========================================

function editTask(id) {

    const task = tasks.find(function (task) {

        return task.id === id;

    });


    if (!task) {

        return;

    }


    const newText = prompt(
        "Update your task:",
        task.text
    );


    // User clicked cancel
    if (newText === null) {

        return;

    }


    const updatedText = newText.trim();


    // Don't allow empty task
    if (updatedText === "") {

        alert("Task cannot be empty.");

        return;

    }


    task.text = updatedText;


    saveTasks();

    renderTasks();

}


// ==========================================
// FILTER TASKS
// ==========================================

function setFilter(filter) {

    currentFilter = filter;


    // Remove active class from every button
    filterButtons.forEach(function (button) {

        button.classList.remove("active");

    });


    // Add active class to selected button
    filterButtons.forEach(function (button) {

        if (button.dataset.filter === filter) {

            button.classList.add("active");

        }

    });


    renderTasks();

}


// ==========================================
// DISPLAY TASKS
// ==========================================

function renderTasks() {

    // Clear current list
    taskList.innerHTML = "";


    // Filter tasks
    let filteredTasks = tasks;


    if (currentFilter === "completed") {

        filteredTasks = tasks.filter(function (task) {

            return task.completed === true;

        });

    }


    else if (currentFilter === "pending") {

        filteredTasks = tasks.filter(function (task) {

            return task.completed === false;

        });

    }


    // No tasks
    if (filteredTasks.length === 0) {

        taskList.innerHTML = `
            <div class="empty">
                No tasks found.
            </div>
        `;

        updateStats();

        return;

    }


    // Create every task
    filteredTasks.forEach(function (task) {

        const taskElement = document.createElement("div");


        taskElement.classList.add("task");


        // Add completed class
        if (task.completed) {

            taskElement.classList.add("completed");
        }
        taskElement.innerHTML = `
            <div class="task-left">
                <input
                    type="checkbox"
                    class="task-checkbox"
                    ${task.completed ? "checked" : ""}
                >
                <span class="task-text">
                    ${escapeHTML(task.text)}
                </span>
            </div>
            <div class="task-actions">
                <button class="edit-btn">
                    Edit
                </button>
                <button class="delete-btn">
                    Delete
                </button>
            </div>
        `;
        const checkbox =
            taskElement.querySelector(".task-checkbox");
        checkbox.addEventListener(
            "change",
            function () {
                toggleTask(task.id);
            }
        );
        const editButton =
            taskElement.querySelector(".edit-btn");
        editButton.addEventListener(
            "click",
            function () {
                editTask(task.id);
            }
        );
        const deleteButton =
            taskElement.querySelector(".delete-btn");
        deleteButton.addEventListener(
            "click",
            function () {
                deleteTask(task.id);
            }
        );
        taskList.appendChild(taskElement);
    });
    updateStats();
}

function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(function (task) {
        return task.completed === true;
    }).length;
    const pending = tasks.filter(function (task) {
        return task.completed === false;
    }).length;
    totalTasks.textContent = total;
    completedTasks.textContent = completed;
    pendingTasks.textContent = pending;
}
function escapeHTML(text) {

    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}



addTaskBtn.addEventListener(
    "click",
    addTask
);


taskInput.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Enter") {

            addTask();

        }

    }
);


filterButtons.forEach(function (button) {

    button.addEventListener(
        "click",
        function () {
            const filter =
                button.dataset.filter;
            setFilter(filter);
        }
    );
});


loadTasks();

renderTasks();