from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers


User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    password = serializers.CharField(write_only=True, trim_whitespace=False)
    username = serializers.CharField(required=False, allow_blank=True)
    first_name = serializers.CharField(required=True, allow_blank=False)
    last_name = serializers.CharField(required=True, allow_blank=False)
    email = serializers.EmailField(required=True, allow_blank=False)
    phone_number = serializers.CharField(required=True, allow_blank=False)

    class Meta:
        model = User
        fields = ("id", "username", "first_name", "last_name", "email", "password", "phone_number")

    def validate_password(self, value: str):
        validate_password(value)
        return value

    def create(self, validated_data):
        email = validated_data["email"]
        username = validated_data.get("username") or email
        user = User.objects.create_user(
            email=email,
            username=username,
            password=validated_data["password"],
            first_name=validated_data["first_name"],
            last_name=validated_data["last_name"],
            phone_number=validated_data["phone_number"],
        )
        return user
