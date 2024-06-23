document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskList = document.getElementById('task-list');
    const taskTitle = document.getElementById('task-title');
    const taskDescription = document.getElementById('task-description');
    const taskDueDate = document.getElementById('task-due-date');

    // Fetch and display all tasks
    fetchTasks();

    taskForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const taskData = {
            title: taskTitle.value,
            description: taskDescription.value,
            due_date: taskDueDate.value || null,
            completed: false,
        };

        // Create new task
        await fetch('/task/new/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(taskData),
        });

        // Reset form
        taskForm.reset();

        // Refresh task list
        fetchTasks();
    });

    async function fetchTasks() {
        const response = await fetch('/task/all/');
        const tasks = await response.json();
        displayTasks(tasks);
    }

    function displayTasks(tasks) {
        taskList.innerHTML = '';
        tasks.sort((a, b) => a.completed - b.completed || new Date(a.due_date) - new Date(b.due_date));

        tasks.forEach(task => {
            const taskItem = document.createElement('div');
            taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
            taskItem.innerHTML = `
                <div>
                    <input type="checkbox" ${task.completed ? 'checked' : ''} data-id="${task.task_id}" class="task-status">
                    <input type="text" value="${task.title}" data-id="${task.task_id}" class="task-title">
                    <textarea data-id="${task.task_id}" class="task-description">${task.description}</textarea>
                    <input type="date" value="${task.due_date || ''}" data-id="${task.task_id}" class="task-due-date">
                    <button data-id="${task.task_id}" class="save-task">Save</button>
                    <button data-id="${task.task_id}" class="delete-task">Delete</button>
                </div>
            `;

            taskList.appendChild(taskItem);
        });

        // Add event listeners for checkboxes
        document.querySelectorAll('.task-status').forEach(checkbox => {
            checkbox.addEventListener('change', async (event) => {
                const taskId = event.target.getAttribute('data-id');
                const task = tasks.find(t => t.task_id === taskId);
                task.completed = event.target.checked;

                await fetch(`/task/${taskId}/update/`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(task),
                });

                fetchTasks();
            });
        });

        // Add event listeners for save buttons
        document.querySelectorAll('.save-task').forEach(button => {
            button.addEventListener('click', async (event) => {
                const taskId = event.target.getAttribute('data-id');
                const task = tasks.find(t => t.task_id === taskId);
                const titleInput = document.querySelector(`.task-title[data-id="${taskId}"]`);
                const descriptionInput = document.querySelector(`.task-description[data-id="${taskId}"]`);
                const dueDateInput = document.querySelector(`.task-due-date[data-id="${taskId}"]`);

                task.title = titleInput.value;
                task.description = descriptionInput.value;
                task.due_date = dueDateInput.value || null;

                await fetch(`/task/${taskId}/update/`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(task),
                });

                fetchTasks();
            });
        });

        // Add event listeners for delete buttons
        document.querySelectorAll('.delete-task').forEach(button => {
            button.addEventListener('click', async (event) => {
                const taskId = event.target.getAttribute('data-id');

                await fetch(`/task/${taskId}/delete/`, {
                    method: 'DELETE',
                });

                fetchTasks();
            });
        });
    }
});
