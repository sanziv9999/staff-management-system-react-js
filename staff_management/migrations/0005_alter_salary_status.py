# Generated by Django 5.1.7 on 2025-03-15 15:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('staff_management', '0004_alter_staff_department'),
    ]

    operations = [
        migrations.AlterField(
            model_name='salary',
            name='status',
            field=models.CharField(choices=[('Pending', 'Pending'), ('Paid', 'Paid')], default='Pending', max_length=10),
        ),
    ]
