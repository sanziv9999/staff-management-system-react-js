# Generated by Django 5.1.7 on 2025-03-15 16:16

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('staff_management', '0007_attendance_unique_staff_date'),
    ]

    operations = [
        migrations.RemoveConstraint(
            model_name='attendance',
            name='unique_staff_date',
        ),
    ]
