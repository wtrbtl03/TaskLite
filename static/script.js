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
            taskItem.className = `task-item bg-white rounded-lg shadow-md p-4 flex items-start space-x-4 mb-4 ${task.completed ? 'bg-green-100' : ''}`;
            taskItem.innerHTML = `
                <input type="checkbox" ${task.completed ? 'checked' : ''} data-id="${task.task_id}" class="mt-1 form-checkbox h-5 w-5 text-blue-600 task-status">
                <div class="flex-grow">
                    <input type="text" value="${task.title}" data-id="${task.task_id}" class="editable-input task-title hidden font-semibold mb-2">
                    <textarea data-id="${task.task_id}" class="editable-textarea task-description hidden text-gray-600 mb-2">${task.description}</textarea>
                    <input type="date" value="${task.due_date || ''}" data-id="${task.task_id}" class="editable-input task-due-date hidden text-sm text-gray-500 mb-2">
                    <p class="task-title-display font-semibold mb-2">${task.title}</p>
                    <p class="task-description-display text-gray-600 mb-2">${task.description}</p>
                    <p class="task-due-date-display text-sm text-gray-500 mb-2">Due: ${task.due_date || 'N/A'}</p>
                    <button data-id="${task.task_id}" class="edit-task bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition duration-300">Edit</button>
                    <button data-id="${task.task_id}" class="save-task bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300 hidden">Save</button>
                    <button data-id="${task.task_id}" class="delete-task bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-300">Delete</button>
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

        // Add event listeners for edit buttons
        document.querySelectorAll('.edit-task').forEach(button => {
            button.addEventListener('click', (event) => {
                const taskId = event.target.getAttribute('data-id');
                const taskItem = event.target.closest('.task-item');
                taskItem.querySelector('.task-title').classList.remove('hidden');
                taskItem.querySelector('.task-description').classList.remove('hidden');
                taskItem.querySelector('.task-due-date').classList.remove('hidden');
                taskItem.querySelector('.save-task').classList.remove('hidden');
                taskItem.querySelector('.edit-task').classList.add('hidden');
                taskItem.querySelector('.task-title-display').classList.add('hidden');
                taskItem.querySelector('.task-description-display').classList.add('hidden');
                taskItem.querySelector('.task-due-date-display').classList.add('hidden');
            });
        });

        // Add event listeners for save buttons
        document.querySelectorAll('.save-task').forEach(button => {
            button.addEventListener('click', async (event) => {
                const taskId = event.target.getAttribute('data-id');
                const titleInput = document.querySelector(`.task-title[data-id="${taskId}"]`);
                const descriptionInput = document.querySelector(`.task-description[data-id="${taskId}"]`);
                const dueDateInput = document.querySelector(`.task-due-date[data-id="${taskId}"]`);

                const updatedTask = {
                    title: titleInput.value,
                    description: descriptionInput.value,
                    due_date: dueDateInput.value || null,
                    completed: document.querySelector(`.task-status[data-id="${taskId}"]`).checked,
                };

                await fetch(`/task/${taskId}/update/`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updatedTask),
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
