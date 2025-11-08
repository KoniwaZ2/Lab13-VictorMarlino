from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    ROLE_CHOISES=(
        ('student', 'Student'),
        ('instructor', 'Instructor'),
    )
    MAJOR_CHOICES=(
        ('artificial_intelligence_and_robotics', 'AIR'),
        ('business_mathematics', 'BM'),
        ('digital_business_technology', 'DBT'),
        ('product_design_engineering', 'PDE'),
        ('energy_business_technology', 'EBT'),
        ('food_business_technology', 'FBT'),
    )

    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=100)
    major = models.CharField(max_length=50, choices=MAJOR_CHOICES, blank=True, null=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOISES)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'full_name']

    def __str__(self):
        return self.email
    
class Nilai (models.Model):
    mahasiswa = models.ForeignKey(
        CustomUser, 
        on_delete=models.CASCADE,
        limit_choices_to={'role': 'student'}
    )
    matkul = models.CharField(max_length=100)
    nilai = models.FloatField()

    def __str__(self):
        return f"{self.mahasiswa.email} - {self.matkul}: {self.nilai}"
    
    def clean(self):
        from django.core.exceptions import ValidationError
        if self.mahasiswa.role != 'student':
            raise ValidationError('Nilai hanya bisa diberikan kepada mahasiswa (student).')
    
    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)