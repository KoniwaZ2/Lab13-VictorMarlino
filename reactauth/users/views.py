from rest_framework import generics, permissions

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
        if hasattr(user, 'role') and user.role == 'student':
            return Nilai.objects.filter(mahasiswa=user)
        return Nilai.objects.all()