from rest_framework import serializers
from .models import *
from django.contrib.auth.hashers import check_password
from .models import Staff
import logging
from rest_framework_simplejwt.tokens import RefreshToken
logger = logging.getLogger(__name__)

class StaffSerializer(serializers.ModelSerializer):
    class Meta:
        model = Staff
        fields = [
            'first_name', 'middle_name', 'last_name', 'username', 'email', 'password',
            'department', 'dob', 'location_lat', 'location_lng', 'location_address',
            'profile_picture', 'cv', 'certificate_type', 'certificate_title',
            'certificate_description', 'certificate_issue_date', 'certificate_file'
        ]
        extra_kwargs = {'password': {'write_only': True}}

    def validate(self, data):
        if data.get('password') != self.initial_data.get('confirm_password'):
            raise serializers.ValidationError("Passwords do not match")
        return data

    def create(self, validated_data):
        password = validated_data.pop('password')
        staff = Staff.objects.create_staff(
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            password=password,
            department=validated_data['department'],
            username=validated_data['username'],
            middle_name=validated_data.get('middle_name'),
            dob=validated_data.get('dob'),
            location_lat=validated_data.get('location_lat'),
            location_lng=validated_data.get('location_lng'),
            location_address=validated_data.get('location_address'),
            profile_picture=validated_data.get('profile_picture'),
            cv=validated_data.get('cv'),
        )
        return staff

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


# serializers.py
class StaffRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)
    confirm_password = serializers.CharField(write_only=True, required=True)
    department = serializers.PrimaryKeyRelatedField(queryset=Department.objects.all(), required=True)
    profile_picture = serializers.ImageField(required=False, allow_null=True)
    cv = serializers.FileField(required=False, allow_null=True)
    certificate_file = serializers.FileField(required=False, allow_null=True)  # Optional certificate file

    class Meta:
        model = Staff
        fields = [
            'first_name', 'middle_name', 'last_name', 'username', 'email', 'password', 'confirm_password',
            'department', 'dob', 'location_lat', 'location_lng', 'location_address', 'profile_picture', 'cv',
            'certificate_type', 'certificate_title', 'certificate_description', 'certificate_issue_date', 'certificate_file'
        ]

    def validate_email(self, value):
        if Staff.objects.filter(email=value).exists():
            raise serializers.ValidationError("A staff member with this email already exists.")
        return value

    def validate_username(self, value):
        if Staff.objects.filter(username=value).exists():
            raise serializers.ValidationError("A staff member with this username already exists.")
        return value

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError({"confirm_password": "Passwords do not match."})
        return data

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        staff = Staff.objects.create_staff(
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            password=validated_data['password'],
            department=validated_data['department'],
            username=validated_data['username'],
            middle_name=validated_data.get('middle_name'),
            dob=validated_data.get('dob'),
            location_lat=validated_data.get('location_lat'),
            location_lng=validated_data.get('location_lng'),
            location_address=validated_data.get('location_address'),
            profile_picture=validated_data.get('profile_picture'),
            cv=validated_data.get('cv'),
            certificate_type=validated_data.get('certificate_type'),
            certificate_title=validated_data.get('certificate_title'),
            certificate_description=validated_data.get('certificate_description'),
            certificate_issue_date=validated_data.get('certificate_issue_date'),
            certificate_file=validated_data.get('certificate_file'),
        )
        return staff

    def to_representation(self, instance):
        refresh = RefreshToken.for_user(instance)
        return {
            'access': str(refresh.access_token),
            'is_staff': instance.is_staff,
            'department': instance.department.id,
            'staff_id': instance.id,
            'user_name': instance.username,
        }
    
    

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