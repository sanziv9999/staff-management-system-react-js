# Generated by Django 5.1.7 on 2025-03-15 15:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('staff_management', '0005_alter_salary_status'),
    ]

    operations = [
        migrations.AlterField(
            model_name='attendance',
            name='status',
            field=models.CharField(choices=[('Present', 'Present'), ('Absent', 'Absent'), ('Leave', 'Leave')], default='Present', max_length=10),
        ),
    ]
