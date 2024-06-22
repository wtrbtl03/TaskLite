from django.shortcuts import render
from django.http import HttpResponse
from task.models import Task

def home(request):
    tasks = Task.objects.all()
    return render(request, 'index.html', {'tasks': tasks})