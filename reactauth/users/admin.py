from django.contrib import admin
from .models import CustomUser, Nilai
from django.contrib.auth.admin import UserAdmin

class CustomUserAdmin(UserAdmin):
    list_display = ('email', 'full_name', 'role', 'major', 'is_staff', 'is_active')
    list_filter = ('role', 'major', 'is_staff', 'is_active')

    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal Info', {'fields': ('full_name', 'major', 'role')}),
        ('Mata Kuliah (Dosen)', {'fields': ('matkul_diajar',), 'description': 'Khusus untuk dosen - daftar mata kuliah yang diajar'}),
        ('Permissions', {'fields': ('is_staff', 'is_active', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important Dates', {'fields': ('last_login', 'date_joined')}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'full_name', 'major', 'role', 'matkul_diajar', 'password1', 'password2', 'is_staff', 'is_active')}
        ),
    )

    ordering = ('email',)

class NilaiAdmin(admin.ModelAdmin):
    list_display = ('mahasiswa', 'matkul', 'nilai')
    search_fields = ('mahasiswa__email', 'matkul')

admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(Nilai, NilaiAdmin)