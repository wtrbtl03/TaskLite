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
            taskItem.className = `task-item p-4 mb-4 rounded-lg shadow-md flex items-start space-x-4 ${task.completed ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-50 text-white' : 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white'}`;
            taskItem.innerHTML = `
                <input type="checkbox" ${task.completed ? 'checked' : ''} data-id="${task.task_id}" class="task-status mt-1 form-checkbox h-5 w-5 text-blue-600">
                <div class="flex-grow">
                    <h3 class="font-semibold">${task.title}</h3>
                    <p class="text-gray-200">${task.description}</p>
                    <p class="text-sm text-gray-300">Due: ${task.due_date}</p>
                </div>
            `;

            if (!task.completed) {
                taskItem.innerHTML += `
                    <button data-id="${task.task_id}" class="edit-task bg-blue-500 text-white px-4 py-2 rounded-md">Edit</button>
                    <button data-id="${task.task_id}" class="delete-task bg-red-500 text-white px-4 py-2 rounded-md">Delete</button>
                `;
            }

            // Edit task event listener
            const editButton = taskItem.querySelector('.edit-task');
            if (editButton) {
                editButton.addEventListener('click', () => editTask(task)); // Ensure editTask function is correctly implemented
            }

            // Delete task event listener
            const deleteButton = taskItem.querySelector('.delete-task');
            if (deleteButton) {
                deleteButton.addEventListener('click', async () => {
                    await deleteTask(task.task_id);
                    fetchTasks();
                });
            }

            taskList.appendChild(taskItem);
        });

        // Add event listener for checkboxes
        document.querySelectorAll('.task-status').forEach(checkbox => {
            checkbox.addEventListener('change', async (event) => {
                const taskId = event.target.getAttribute('data-id');
                const task = tasks.find(t => t.task_id === taskId);
                task.completed = event.target.checked;

                await updateTask(task);
                fetchTasks();
            });
        });
    }

    async function editTask(task) {
        // Populate edit form fields
        document.getElementById('edit-task-id').value = task.task_id;
        document.getElementById('edit-task-title').value = task.title;
        document.getElementById('edit-task-description').value = task.description;
        document.getElementById('edit-task-due-date').value = task.due_date || '';

        // Show edit popup
        const modalBackdrop = document.getElementById('modal-backdrop');
        const modalContent = document.getElementById('modal-content');
        modalBackdrop.classList.remove('hidden');
        modalContent.classList.remove('hidden');
    }

    async function updateTask(task) {
        await fetch(`/task/${task.task_id}/update/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(task),
        });
    }

    async function deleteTask(taskId) {
        await fetch(`/task/${taskId}/delete/`, {
            method: 'DELETE',
        });
    }

    // Event listener for closing modal
    document.getElementById('modal-cancel-edit').addEventListener('click', () => {
        const modalBackdrop = document.getElementById('modal-backdrop');
        const modalContent = document.getElementById('modal-content');
        modalBackdrop.classList.add('hidden');
        modalContent.classList.add('hidden');
    });

    // Event listener for saving edited task
    document.getElementById('modal-save-task').addEventListener('click', async () => {
        const taskId = document.getElementById('edit-task-id').value;
        const updatedTask = {
            task_id: taskId,
            title: document.getElementById('edit-task-title').value,
            description: document.getElementById('edit-task-description').value,
            due_date: document.getElementById('edit-task-due-date').value || null,
        };

        await updateTask(updatedTask);
        fetchTasks();

        // Close modal
        const modalBackdrop = document.getElementById('modal-backdrop');
        const modalContent = document.getElementById('modal-content');
        modalBackdrop.classList.add('hidden');
        modalContent.classList.add('hidden');
    });
});
