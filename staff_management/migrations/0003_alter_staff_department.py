# Generated by Django 5.1.7 on 2025-03-15 06:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('staff_management', '0002_alter_staff_department'),
    ]

    operations = [
        migrations.AlterField(
            model_name='staff',
            name='department',
            field=models.CharField(max_length=100),
        ),
    ]
