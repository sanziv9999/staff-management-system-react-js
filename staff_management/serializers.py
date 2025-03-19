from rest_framework import serializers
from .models import *
from django.contrib.auth.hashers import check_password
from .models import Staff
import logging
logger = logging.getLogger(__name__)

class StaffSerializer(serializers.ModelSerializer):
    department = serializers.PrimaryKeyRelatedField(queryset=Department.objects.all())
    department_name = serializers.CharField(source='department.name', read_only=True)  # Optional for display

    class Meta:
        model = Staff
        fields = ['id', 'name', 'department', 'department_name', 'email']

class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = '__all__'

class ScheduleSerializer(serializers.ModelSerializer):
    staff = StaffSerializer(read_only=True)  # For reading (nested staff data)
    staff_id = serializers.PrimaryKeyRelatedField(
        queryset=Staff.objects.all(), source='staff', write_only=True
    )  # For writing (accepts staff ID)

    class Meta:
        model = Schedule
        fields = ['id', 'staff', 'staff_id', 'date', 'shift', 'location']

class SalarySerializer(serializers.ModelSerializer):
    staff = StaffSerializer(read_only=True)
    staff_id = serializers.PrimaryKeyRelatedField(
        queryset=Staff.objects.all(), source='staff', write_only=True
    )

    class Meta:
        model = Salary
        fields = ['id', 'staff', 'staff_id', 'base_salary', 'bonus', 'deductions', 'payment_date', 'status']


class AttendanceSerializer(serializers.ModelSerializer):
    staff = StaffSerializer(read_only=True)
    staff_id = serializers.PrimaryKeyRelatedField(
        queryset=Staff.objects.all(), source='staff', write_only=True
    )

    class Meta:
        model = Attendance
        fields = ['id', 'staff', 'staff_id', 'date', 'status', 'time_in', 'time_out']

class SettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Settings
        fields = ['id', 'company_name', 'working_hours', 'currency', 'overtime_rate']

    def validate_currency(self, value):
        valid_currencies = [
            'USD-$', 'EUR-€', 'JPY-¥', 'GBP-£', 'CNY-¥', 'INR-₹', 'NPR-₨', 'CAD-$', 'AUD-$',
            'CHF-₣', 'HKD-$', 'SGD-$', 'SEK-kr', 'NOK-kr', 'DKK-kr', 'NZD-$', 'MXN-$', 'BRL-R$',
            'ZAR-R', 'KRW-₩'
        ]
        if value not in valid_currencies:
            raise serializers.ValidationError(f"Currency must be one of {', '.join(valid_currencies)}.")
        return value

    def validate_overtime_rate(self, value):
        if value <= 0:
            raise serializers.ValidationError("Overtime rate must be greater than 0.")
        return value

    def validate(self, data):
        if not data.get('company_name') or not data.get('working_hours') or not data.get('currency'):
            raise serializers.ValidationError("All fields are required.")
        return data


class StaffRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)
    department = serializers.PrimaryKeyRelatedField(queryset=Department.objects.all(), required=True)

    class Meta:
        model = Staff
        fields = ['name', 'email', 'password', 'department']

    def validate_email(self, value):
        if Staff.objects.filter(email=value).exists():
            raise serializers.ValidationError("A staff member with this email already exists.")
        return value

    def create(self, validated_data):
        # Create staff user using the custom manager method
        staff = Staff.objects.create_staff(
            email=validated_data['email'],
            name=validated_data['name'],
            password=validated_data['password'],
            department=validated_data['department']
        )
        return staff
    

class StaffLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')
        logger.info(f"Attempting to validate credentials for: {email}")

        # Try to get the staff user by email
        try:
            user = Staff.objects.get(email=email)
        except Staff.DoesNotExist:
            logger.error(f"No staff user found with email: {email}")
            raise serializers.ValidationError('Invalid credentials')

        # Check if the password matches
        if not check_password(password, user.password):
            logger.error(f"Password mismatch for {email}")
            raise serializers.ValidationError('Invalid credentials')

        # Check if the user is a staff member and not a superuser
        if not user.is_staff or user.is_superuser:
            logger.error(f"User {email} is not a valid staff member (is_staff={user.is_staff}, is_superuser={user.is_superuser})")
            raise serializers.ValidationError('This endpoint is for staff login only. Use admin login for superusers.')

        # Check if the user is active
        if not user.is_active:
            logger.error(f"User {email} is inactive")
            raise serializers.ValidationError('This account is inactive')

        logger.info(f"Validated user: {user.email}")
        data['user'] = user
        return data