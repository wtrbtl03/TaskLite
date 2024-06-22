from django.contrib import admin
from django.urls import path, include
from . import views

urlpatterns = [
    path('all/', views.get_tasks, name='get_tasks'),
    path('new/', views.create_task, name='create_task'),
    path('<uuid:task_id>/', views.get_task, name='get_task'),
    path('<uuid:task_id>/update/', views.update_task, name='update_task'),
    path('<uuid:task_id>/delete/', views.delete_task, name='delete_task'),
]