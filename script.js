(function () {

    // Firebase Configuration
    const firebaseConfig = {
        apiKey: "AIzaSyDfYfZQPG2ugfKi4DvrNThFMYAkCtVHdE0",
        authDomain: "maiztodo-1da42.firebaseapp.com",
        databaseURL: "https://maiztodo-1da42-default-rtdb.asia-southeast1.firebasedatabase.app",
        projectId: "maiztodo-1da42",
        storageBucket: "maiztodo-1da42.firebasestorage.app",
        messagingSenderId: "151585497401",
        appId: "1:151585497401:web:3ebce263451f0f3d3008e8",
        measurementId: "G-NCLZE1DW6D"
    };

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    const database = firebase.database();
    const tasksRef = database.ref('tasks');

    var taskInput = document.getElementById("taskInput");
    var priorityInput = document.getElementById("priorityInput");
    var addBtn = document.getElementById("addTaskBtn");
    var taskList = document.getElementById("taskList");
    var emptyState = document.getElementById("emptyState");
    var totalTasksEl = document.getElementById("totalTasks");
    var completedTasksEl = document.getElementById("completedTasks");
    var pendingTasksEl = document.getElementById("pendingTasks");

    var tasks = [];

    /* ---------- EVENT LISTENERS ---------- */

    addBtn.onclick = function () {
        addTask();
    };

    taskInput.onkeypress = function (e) {
        if (e.key === 'Enter') {
            addTask();
        }
    };

    // Real-time listener for tasks
    tasksRef.on('value', function(snapshot) {
        tasks = snapshot.val() || [];
        renderTasks();
        updateStats();
    });

    /* ---------- TASK MANAGEMENT ---------- */

    function addTask() {

        var title = taskInput.value.trim();
        var priority = priorityInput.value;

        if (!title) {
            showNotification("Task cannot be empty", "error");
            return;
        }

        var task = {
            id: Date.now(),
            title: title,
            priority: priority,
            completed: false,
            createdAt: new Date()
        };

        tasks.push(task);
        saveTasks();
        
        // Clear input field after adding task
        taskInput.value = "";
        
        // Firebase will automatically update through the listener
    }

    function deleteTask(id) {
        tasks = tasks.filter(function (task) {
            return task.id !== id;
        });

        saveTasks();
        // Firebase will automatically update through the listener
    }

    function toggleTask(id) {
        tasks.forEach(function (task) {
            if (task.id === id) {
                task.completed = !task.completed;
            }
        });

        saveTasks();
        // Firebase will automatically update through the listener
    }

    function editTask(id) {
        var task = tasks.find(function(t) { return t.id === id; });
        if (!task) return;

        var newTitle = prompt("Edit task:", task.title);

        if (!newTitle || newTitle.trim() === "") return;

        tasks.forEach(function (task) {
            if (task.id === id) {
                task.title = newTitle.trim();
            }
        });

        saveTasks();
        showNotification("Task updated successfully", "success");
        // Firebase will automatically update through the listener
    }

    /* ---------- UI RENDERING ---------- */

    function renderTasks() {

        taskList.innerHTML = "";

        if (tasks.length === 0) {
            emptyState.style.display = "block";
            return;
        }

        emptyState.style.display = "none";

        tasks.forEach(function (task) {

            var li = document.createElement("li");
            li.className = "task-item p-4 border border-gray-200 rounded-lg flex justify-between items-center bg-white";

            var left = document.createElement("div");
            left.className = "flex-1";

            var titleContainer = document.createElement("div");
            titleContainer.className = "flex items-center gap-3 mb-2";

            var checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = task.completed;
            checkbox.className = "w-4 h-4 text-gray-900 rounded border-gray-300 focus:ring-gray-500 cursor-pointer";
            checkbox.onchange = function() {
                toggleTask(task.id);
            };

            var title = document.createElement("p");
            title.textContent = task.title;
            title.className = task.completed ? "completed" : "text-gray-900";

            titleContainer.appendChild(checkbox);
            titleContainer.appendChild(title);

            var badge = document.createElement("span");
            badge.className = "badge " + task.priority;
            badge.textContent = task.priority;

            left.appendChild(titleContainer);
            left.appendChild(badge);

            var actions = document.createElement("div");
            actions.className = "flex gap-2";

            var completeBtn = createButton("✓", function () {
                toggleTask(task.id);
            }, "complete-btn");

            var editBtn = createButton("✎", function () {
                editTask(task.id);
            }, "edit-btn");

            var deleteBtn = createButton("🗑", function () {
                deleteTask(task.id);
            }, "delete-btn");

            actions.appendChild(completeBtn);
            actions.appendChild(editBtn);
            actions.appendChild(deleteBtn);

            li.appendChild(left);
            li.appendChild(actions);

            taskList.appendChild(li);

        });

        updateStats();
    }

    function updateStats() {
        var total = tasks.length;
        var completed = tasks.filter(function(task) {
            return task.completed;
        }).length;
        var pending = total - completed;

        totalTasksEl.textContent = total;
        completedTasksEl.textContent = completed;
        pendingTasksEl.textContent = pending;
    }

    /* ---------- HELPERS ---------- */

    function createButton(text, handler, className) {
        var btn = document.createElement("button");
        btn.textContent = text;
        btn.className = "action-btn px-3 py-2 rounded-lg " + className;
        btn.onclick = handler;
        return btn;
    }

    function showNotification(message, type) {
        var notification = document.createElement("div");
        notification.className = "fixed top-4 right-4 px-6 py-3 rounded-lg text-gray-900 font-medium shadow-sm border border-gray-200 z-50 bg-white";
        notification.textContent = message;
        notification.style.animation = "slideIn 0.3s ease-out";
        
        document.body.appendChild(notification);
        
        setTimeout(function() {
            notification.style.animation = "fadeIn 0.3s ease-out reverse";
            setTimeout(function() {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    function saveTasks() {
        tasksRef.set(tasks);
    }

    /* ---------- INITIAL RENDER ---------- */
    // Initial render will be handled by the Firebase listener

})();
