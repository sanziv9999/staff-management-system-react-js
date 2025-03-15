from django.db import models

class Department(models.Model):
    name = models.CharField(max_length=100)
    manager = models.CharField(max_length=100)
    staff_count = models.IntegerField(default=0)

    def __str__(self):
        return self.name

class Staff(models.Model):
    name = models.CharField(max_length=100)
    role = models.CharField(max_length=100)
    department = models.ForeignKey(Department, on_delete=models.CASCADE)
    email = models.EmailField(unique=True)

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