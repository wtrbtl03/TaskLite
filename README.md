# TaskLite

TaskLite is a simple task management application developed using Django. It supports CRUD functionality that allows users to create, edit, delete, and manage tasks. The front-end is designed using Tailwind CSS for a modern and responsive user interface.

![TaskLite Home](./images/TaskLite Home.jpg | width = 200px)

## Features

- Add new tasks with title, description, and due date
- Edit existing tasks
- Delete tasks
- Mark tasks as completed
- View all tasks in a sorted manner by completion status and due date

![Task Edit Modal](./images/Edit Modal.jpg | width = 200px)

## Technologies Used

### Backend
- Django

### Frontend
- HTML
- JavaScript
- Tailwind CSS


### Prerequisites

- Python 3
- pip (Python package installer)


## API Endpoints

The TaskLite application provides the following API endpoints for managing tasks:

- **GET /task/all/**: Retrieve all tasks
- **POST /task/new/**: Create a new task
- **GET /task/uuid:task_id/**: Retrieve a specific task by ID
- **PUT /task/uuid:task_id/update/**: Update a specific task by ID
- **DELETE /task/uuid:task_id/delete/**: Delete a specific task by ID

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [Django](https://www.djangoproject.com/)
- [Tailwind CSS](https://tailwindcss.com/)