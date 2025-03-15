# Generated by Django 5.1.7 on 2025-03-15 06:34

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('staff_management', '0003_alter_staff_department'),
    ]

    operations = [
        migrations.AlterField(
            model_name='staff',
            name='department',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='staff_management.department'),
        ),
    ]
