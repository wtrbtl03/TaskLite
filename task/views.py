from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import get_object_or_404
from .models import Task
import json

def get_tasks(request):
    tasks = list(Task.objects.values('task_id', 'title', 'description', 'due_date', 'completed', 'created_at', 'updated_at'))
    return JsonResponse(tasks, safe=False)


@csrf_exempt
def create_task(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        title = data['title']
        description = data.get('description', '')   # Default to empty string if not provided
        due_date = data.get('due_date', None)       # Default to None if not provided

        task = Task.objects.create(
            title=title,
            description=description,
            due_date=due_date
        )

        return JsonResponse({
            'task_id': str(task.task_id),
            'title': task.title,
            'description': task.description,
            'due_date': task.due_date,
            'completed': task.completed,
        })
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)
    
def get_task(request, task_id):
    task = get_object_or_404(Task, task_id=task_id)
    return JsonResponse({'task_id': str(task.task_id), 'title': task.title, 'description': task.description, 'due_date': task.due_date, 'completed': task.completed})

@csrf_exempt
def update_task(request, task_id):
    task = get_object_or_404(Task, task_id=task_id)

    if request.method == 'PUT':
        data = json.loads(request.body)
        task.title = data.get('title', task.title)
        task.description = data.get('description', task.description)
        task.due_date = data.get('due_date', task.due_date)
        task.completed = data.get('completed', task.completed)
        task.save()

        return JsonResponse({
            'task_id': str(task.task_id),
            'title': task.title,
            'description': task.description,
            'due_date': task.due_date,
            'completed': task.completed,
        })
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)
@csrf_exempt
def delete_task(request, task_id):
    task = get_object_or_404(Task, task_id=task_id)
    if request.method == 'DELETE':
        task.delete()
        return JsonResponse({'message': 'Task deleted successfully'})