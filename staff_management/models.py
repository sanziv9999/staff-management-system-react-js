from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

class Department(models.Model):
    name = models.CharField(max_length=100)
    manager = models.CharField(max_length=100)
    staff_count = models.IntegerField(default=0)

    def __str__(self):
        return self.name

class StaffManager(BaseUserManager):
    def create_user(self, email, name, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, name=name, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_staff(self, email, name, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        return self.create_user(email, name, password, **extra_fields)

class Staff(AbstractBaseUser, PermissionsMixin):
    name = models.CharField(max_length=100)
    department = models.ForeignKey(Department, on_delete=models.CASCADE)
    email = models.EmailField(unique=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=True)  # All Staff instances are staff
    is_superuser = models.BooleanField(default=False)

    # Add related_name to avoid clashes with default User model
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='staff_groups',  # Unique related_name for Staff
        blank=True,
        help_text='The groups this user belongs to.',
        verbose_name='groups',
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='staff_user_permissions',  # Unique related_name for Staff
        blank=True,
        help_text='Specific permissions for this user.',
        verbose_name='user permissions',
    )

    objects = StaffManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']

    def __str__(self):
        return self.name
    
class Schedule(models.Model):
    staff = models.ForeignKey(Staff, on_delete=models.CASCADE)
    date = models.DateField()
    shift = models.CharField(max_length=50)
    location = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.staff.name} - {self.date}"


class Salary(models.Model):
    staff = models.ForeignKey('Staff', on_delete=models.CASCADE)
    base_salary = models.DecimalField(max_digits=10, decimal_places=2)
    bonus = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    deductions = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    payment_date = models.DateField()
    status = models.CharField(max_length=10, choices=[('Pending', 'Pending'), ('Paid', 'Paid')], default='Pending')

    def __str__(self):
        return f"{self.staff.name} - {self.base_salary}"

class Attendance(models.Model):
    staff = models.ForeignKey('Staff', on_delete=models.CASCADE)
    date = models.DateField()
    status = models.CharField(
        max_length=10,
        choices=[('Present', 'Present'), ('Absent', 'Absent'), ('Leave', 'Leave')],
        default='Present'
    )
    time_in = models.TimeField(null=True, blank=True)
    time_out = models.TimeField(null=True, blank=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['staff', 'date'], name='unique_staff_date')
        ]

    def __str__(self):
        return f"{self.staff.name} - {self.date}"
    
class Settings(models.Model):
    company_name = models.CharField(max_length=100, default="Tokyo Business International")
    working_hours = models.CharField(max_length=50, default="9:00 - 17:00")
    currency = models.CharField(max_length=10, default="Yen-¥")
    overtime_rate = models.FloatField(default=1.5)

    class Meta:
        verbose_name = "Settings"
        verbose_name_plural = "Settings"

    def save(self, *args, **kwargs):
        # Ensure only one instance of Settings exists
        if Settings.objects.exists() and not self.pk:
            raise ValueError("Settings instance already exists. Use the existing instance to update settings.")
        super().save(*args, **kwargs)

    def __str__(self):
        return "Company Settings"