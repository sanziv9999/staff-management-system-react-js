from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import StaffViewSet, DepartmentViewSet, ScheduleViewSet, SalaryViewSet, AttendanceViewSet, LoginView

router = DefaultRouter()
router.register(r'staff', StaffViewSet)
router.register(r'departments', DepartmentViewSet)
router.register(r'schedules', ScheduleViewSet)
router.register(r'salaries', SalaryViewSet)
router.register(r'attendance', AttendanceViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('login/', LoginView.as_view(), name='login'),
]