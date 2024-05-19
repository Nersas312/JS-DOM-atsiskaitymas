document.addEventListener("DOMContentLoaded", function () {
    loadTasks();
});

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const tableBody = document.getElementById("subjectTableBody");
    tableBody.innerHTML = "";

    tasks.forEach(function (task, index) {
        const newRow = document.createElement("tr");

        newRow.innerHTML = `
            <td><i class="bi bi-check tick-icon ${task.completed ? 'completed' : ''}" data-index="${index}" style="cursor: pointer;"></i></td>
            <td class="${task.completed ? 'completed' : ''}">${task.subject}</td>
            <td class="priority-cell" data-index="${index}" style="background-color: ${getPriorityColor(task.priority)}">${task.priority}</td>
            <td class="status-cell" data-index="${index}" style="cursor: pointer;">${task.status}</td>
            <td class="date-cell" data-index="${index}" style="cursor: pointer;">${task.dueDate}</td>
            <td><button class="btn btn-danger delete-btn" data-index="${index}"><i class="bi bi-trash"></i></button></td>
        `;
        tableBody.appendChild(newRow);
    });

    document.querySelectorAll('.priority-cell').forEach(function (cell) {
        cell.addEventListener('click', function () {
            const index = this.getAttribute('data-index');
            tasks[index].priority = getNextPriority(tasks[index].priority);
            saveTasks(tasks);
            loadTasks();
        });
    });

    document.querySelectorAll('.status-cell').forEach(function (cell) {
        cell.addEventListener('click', function () {
            const index = this.getAttribute('data-index');
            tasks[index].status = toggleStatus(tasks[index].status);
            saveTasks(tasks);
            loadTasks();
        });
    });

    document.querySelectorAll('.tick-icon').forEach(function (tickIcon) {
        tickIcon.addEventListener('click', function () {
            const index = this.getAttribute('data-index');
            tasks[index].completed = !tasks[index].completed;
            if (tasks[index].completed) {
                tasks[index].status = "Completed";
            } else {
                tasks[index].status = "In Progress";
            }
            saveTasks(tasks);
            loadTasks();
        });
    });

    document.querySelectorAll('.date-cell').forEach(function (dateCell) {
        dateCell.addEventListener('click', function () {
            const index = this.getAttribute('data-index');
            const newDate = prompt("Enter the new due date (YYYY-MM-DD):");
            if (newDate && isValidDate(newDate)) {
                tasks[index].dueDate = newDate;
                saveTasks(tasks);
                loadTasks();
            } else {
                alert("Please enter a valid date in the format YYYY-MM-DD.");
            }
        });
    });

    document.querySelectorAll('.delete-btn').forEach(function (button) {
        button.addEventListener('click', function () {
            const index = this.getAttribute('data-index');
            tasks.splice(index, 1);
            saveTasks(tasks);
            loadTasks();
        });
    });
}

function getPriorityColor(priority) {
    const priorityColors = {
        'low': 'blue',
        'normal': 'green',
        'high': 'red'
    };
    return priorityColors[priority.toLowerCase()] || 'white';
}

function getNextPriority(currentPriority) {
    switch (currentPriority) {
        case 'low':
            return 'normal';
        case 'normal':
            return 'high';
        case 'high':
            return 'low';
        default:
            return 'low';
    }
}

function toggleStatus(currentStatus) {
    return currentStatus === 'New' ? 'In Progress' : 'New';
}

function isValidPriority(priority) {
    return ['low', 'normal', 'high'].includes(priority.toLowerCase());
}

function isValidDate(dateString) {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateString)) {
        return false;
    }

    const [year, month, day] = dateString.split('-').map(Number);
    if (month < 1 || month > 12 || day < 1 || day > 31) {
        return false;
    }

    return !isNaN(new Date(dateString));
}


function saveTasks(tasks) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

document.getElementById("addSubjectBtn").addEventListener("click", function () {
    const subjectName = prompt("Enter the subject:");
    if (subjectName) {
        let priority, dueDate;
        do {
            priority = prompt("Enter the priority (Low/Normal/High):");
        } while (!isValidPriority(priority));

        do {
            dueDate = prompt("Enter the due date (YYYY-MM-DD):");
        } while (!isValidDate(dueDate));

        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks.push({
            subject: subjectName,
            priority: priority.toLowerCase(),
            status: "New",
            dueDate: dueDate,
            completed: false
        });
        saveTasks(tasks);
        loadTasks();
    }
});
