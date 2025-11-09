from rest_framework import generics, permissions
from rest_framework.response import Response
from users.models import Nilai
from .serializers import NilaiSerializer, RegisterSerializer, CustomTokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class NilaiListView(generics.ListCreateAPIView):
    serializer_class = NilaiSerializer
    permission_classes = (permissions.AllowAny,)

    def get_queryset(self):
        user = self.request.user
        
        # Jika user tidak terautentikasi, return empty
        if not user or not user.is_authenticated:
            return Nilai.objects.none()
        
        # Mahasiswa hanya bisa lihat nilai mereka sendiri
        if hasattr(user, 'role') and user.role == 'student':
            return Nilai.objects.filter(mahasiswa=user)
        
        # Dosen bisa lihat nilai mahasiswa di mata kuliah yang mereka ajar
        if hasattr(user, 'role') and user.role == 'instructor':
            matkul_diajar = getattr(user, 'matkul_diajar', [])
            if matkul_diajar:
                return Nilai.objects.filter(matkul__in=matkul_diajar)
            return Nilai.objects.none()
        
        return Nilai.objects.none()
    
    def get_serializer_context(self):
        """Pass request to serializer for validation"""
        context = super().get_serializer_context()
        context['request'] = self.request
        return context


class StudentListView(generics.ListAPIView):
    """List all students - untuk dropdown pilihan mahasiswa saat input nilai"""
    permission_classes = (permissions.AllowAny,)
    
    def list(self, request, *args, **kwargs):
        students = User.objects.filter(role='student').values('id', 'email', 'full_name', 'major')
        return Response(list(students))