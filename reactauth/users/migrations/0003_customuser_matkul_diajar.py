# Generated manually for adding matkul_diajar field

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0002_nilai'),
    ]

    operations = [
        migrations.AddField(
            model_name='customuser',
            name='matkul_diajar',
            field=models.JSONField(blank=True, default=list, help_text='Daftar mata kuliah yang diajar (khusus dosen)'),
        ),
    ]
