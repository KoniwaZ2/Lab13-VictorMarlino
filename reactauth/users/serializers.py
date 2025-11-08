from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
import re
import users.models as user_models

User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    password_confirmation = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})

    class Meta:
        model = User
        fields = ('email', 'username', 'full_name', 'major', 'role', 'password', 'password_confirmation')
        extra_kwargs = {
            'password': {'write_only': True, 'style': {'input_type': 'password'}},
            'full_name': {'required': True},
            'major': {'required': False},
        }

    def validate_email(self, value):
        email = value.lower()
        student_pattern = re.compile(r'^[a-zA-Z0-9._%+-]+@student\.prasetiyamulya\.ac\.id')
        instructor_pattern = re.compile(r'^[a-zA-Z0-9._%+-]+@prasetiyamulya\.ac\.id')

        if student_pattern.match(email) or instructor_pattern.match(email):
            if User.objects.filter(email=email).exists():
                raise serializers.ValidationError("Email is already registered.")
            return email
        else:
            raise serializers.ValidationError("Email must be a valid student or instructor email address.")
        
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirmation']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs
    
    def create(self, validated_data):
        # Remove password_confirmation from validated_data
        validated_data.pop('password_confirmation', None)
        
        email = validated_data['email'].lower()

        username = email.split('@')[0]
        domain = email.split('@')[1]

        role = ""
        if domain == 'student.prasetiyamulya.ac.id':
            role = 'student'
        elif domain == 'prasetiyamulya.ac.id':
            role = 'instructor'

        # Use create_user to properly hash the password
        user = User.objects.create_user(
            email=email,
            username=username,
            password=validated_data['password'],
            full_name=validated_data['full_name'],
            major=validated_data.get('major', ''),
            role=role,
        )
        return user
    
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate_email(self, value):
        return value.lower()
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['email'] = user.email
        token['full_name'] = user.full_name
        token['role'] = user.role
        token['major'] = user.major

        return token
    
    def validate(self, attrs):
        data = super().validate(attrs)

        token_data = {
            'access': data['access'],
            'refresh': data['refresh'],
        }

        data.update({
            "email": self.user.email,
            "full_name": self.user.full_name,
            "role": self.user.role,
            "major": self.user.major,
            "token": token_data,
        })
        return data
    
class NilaiSerializer(serializers.ModelSerializer):
    mahasiswa = serializers.SerializerMethodField()

    class Meta:
        model = user_models.Nilai
        fields = ('id', 'mahasiswa', 'matkul', 'nilai')

    def get_mahasiswa(self, obj):
        user = obj.mahasiswa
        return {
            'id': user.id,
            'email': user.email,
            'full_name': user.full_name,
            'major': user.major,
            'role': user.role,
        }