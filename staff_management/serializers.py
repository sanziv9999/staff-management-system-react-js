from rest_framework import serializers
from .models import *

class StaffSerializer(serializers.ModelSerializer):
    department = serializers.PrimaryKeyRelatedField(queryset=Department.objects.all())
    department_name = serializers.CharField(source='department.name', read_only=True)  # Optional for display

    class Meta:
        model = Staff
        fields = ['id', 'name', 'role', 'department', 'department_name', 'email']

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
    staff = StaffSerializer(read_only=True)  # For reading (fetching data)
    staff_id = serializers.PrimaryKeyRelatedField(
        queryset=Staff.objects.all(), source='staff', write_only=True
    )  # For writing (creating/updating)

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