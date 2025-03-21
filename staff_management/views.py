from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny,IsAuthenticated, IsAdminUser
from django.contrib.auth import authenticate
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from django.db import IntegrityError
from .models import *
from .serializers import *

from rest_framework.permissions import AllowAny, IsAuthenticated

class StaffViewSet(viewsets.ModelViewSet):
    queryset = Staff.objects.all()
    serializer_class = StaffSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsAuthenticated()]

class DepartmentViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer

class ScheduleViewSet(viewsets.ModelViewSet):
    queryset = Schedule.objects.all()
    serializer_class = ScheduleSerializer

class SalaryViewSet(viewsets.ModelViewSet):
    queryset = Salary.objects.all()
    serializer_class = SalarySerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = self.queryset
        # Filter by staff_id if provided
        staff_id = self.request.query_params.get('staff_id')
        if staff_id:
            queryset = queryset.filter(staff_id=staff_id)
        return queryset
    
class AttendanceViewSet(viewsets.ModelViewSet):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        logger.info("Fetching attendance records")
        queryset = self.queryset
        # Filter by date if provided
        date = self.request.query_params.get('date')
        if date:
            queryset = queryset.filter(date=date)
        # Filter by staff_id if provided
        staff_id = self.request.query_params.get('staff_id')
        if staff_id:
            queryset = queryset.filter(staff_id=staff_id)
        return queryset

    def create(self, request, *args, **kwargs):
        logger.info(f"Received attendance creation request: {request.data}")
        logger.info(f"Request headers: {request.headers}")

        staff_id = request.data.get('staff_id')
        if not staff_id:
            logger.error("No staff_id provided in the request")
            return Response(
                {"detail": "staff_id is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            staff = Staff.objects.get(id=staff_id)
        except Staff.DoesNotExist:
            logger.error(f"Staff with ID {staff_id} does not exist")
            return Response(
                {"detail": "Staff with this ID does not exist."},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            logger.info(f"Attendance created successfully: {serializer.data}")
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        except IntegrityError as e:
            if 'unique_staff_date' in str(e):
                logger.error(f"Duplicate attendance record for staff_id {staff_id} on date {request.data.get('date')}")
                return Response(
                    {"detail": "An attendance record for this staff on this date already exists."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            raise
        except ValidationError as e:
            logger.error(f"Validation error: {e.detail}")
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)

    def perform_create(self, serializer):
        staff_id = self.request.data.get('staff_id')
        staff = Staff.objects.get(id=staff_id)
        serializer.save(staff=staff)
        
class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'is_admin': user.is_superuser,  # Add is_admin flag to the response
            }, status=status.HTTP_200_OK)
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

class SettingsViewSet(viewsets.ModelViewSet):
    queryset = Settings.objects.all()
    serializer_class = SettingsSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        # Disallow creation of new settings
        return Response({"detail": "Creating new settings is not allowed. Update the existing settings instead."}, 
                       status=status.HTTP_403_FORBIDDEN)

    def get_object(self):
        # Always return the first (and only) settings instance
        obj, created = Settings.objects.get_or_create(pk=1)  # Ensure one instance exists
        return obj

# views.py
class StaffLoginView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        serializer = StaffLoginSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            user = serializer.validated_data['user']
            refresh = RefreshToken.for_user(user)
            logger.info(f"Login successful for staff ID: {user.id}, email: {user.email}")
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'is_staff': True,
                'staff_id': user.id,
                'department': user.department.name,
                'user_name': user.name,
            }, status=status.HTTP_200_OK)
        email = request.data.get('email', 'unknown')
        logger.error(f"Login failed for email: {email} - Errors: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_401_UNAUTHORIZED)
    
import logging

logger = logging.getLogger(__name__)

class StaffRegistrationView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        logger.info(f"Received data: {request.data}")
        serializer = StaffRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            staff = serializer.save()
            # Let the serializer handle the response format
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        logger.error(f"Serializer errors: {serializer.errors}")
        return Response(
            {
                "error": "Registration failed",
                "details": serializer.errors
            },
            status=status.HTTP_400_BAD_REQUEST
        )