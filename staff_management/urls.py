from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()
router.register(r'departments', DepartmentViewSet)
router.register(r'schedules', ScheduleViewSet)
router.register(r'salaries', SalaryViewSet)
router.register(r'settings', SettingsViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('login/', LoginView.as_view(), name='login'),
    path('staff/login/', StaffLoginView.as_view(), name='staff_login'),
    path('staff/register/', StaffRegistrationView.as_view(), name='staff_register'),
    path('attendance/', AttendanceViewSet.as_view({'get': 'list', 'post': 'create'}), name='attendance'),
    path('attendance/<int:pk>/', AttendanceViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'}), name='attendance-detail'),
    path('staff/', StaffViewSet.as_view({'get': 'list', 'post': 'create'}), name='staff-list'),
    path('staff/<int:pk>/', StaffViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'}), name='staff-detail'),
]