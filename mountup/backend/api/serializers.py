from django.contrib.auth.models import User
from rest_framework import serializers

from .models import Ascent, Comment, Mountain, UserProfile


class RegisterSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=8)
    full_name = serializers.CharField(max_length=150, required=False, allow_blank=True)
    country = serializers.CharField(max_length=80, required=False, allow_blank=True)

    def validate_username(self, value: str) -> str:
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("username already exists")
        return value

    def validate_email(self, value: str) -> str:
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("email already exists")
        return value


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    password = serializers.CharField(write_only=True)


class LogoutSerializer(serializers.Serializer):
    refresh = serializers.CharField()


class MountainSerializer(serializers.ModelSerializer):
    created_by_username = serializers.CharField(source="created_by.username", read_only=True)
    difficulty_label = serializers.CharField(source="get_difficulty_display", read_only=True)

    class Meta:
        model = Mountain
        fields = [
            "id",
            "name",
            "location",
            "image_url",
            "elevation_m",
            "difficulty",
            "difficulty_label",
            "description",
            "is_featured",
            "created_by",
            "created_by_username",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["created_by", "created_by_username", "created_at", "updated_at"]


class AscentSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)
    mountain_name = serializers.CharField(source="mountain.name", read_only=True)
    mountain_elevation_m = serializers.IntegerField(source="mountain.elevation_m", read_only=True)
    mountain_difficulty = serializers.CharField(source="mountain.difficulty", read_only=True)
    mountain_difficulty_label = serializers.CharField(source="mountain.get_difficulty_display", read_only=True)

    class Meta:
        model = Ascent
        fields = [
            "id",
            "user",
            "username",
            "mountain",
            "mountain_name",
            "mountain_elevation_m",
            "mountain_difficulty",
            "mountain_difficulty_label",
            "climbed_on",
            "notes",
            "status",
            "awarded_xp",
            "created_at",
        ]
        read_only_fields = [
            "user",
            "username",
            "mountain_name",
            "mountain_elevation_m",
            "mountain_difficulty",
            "mountain_difficulty_label",
            "awarded_xp",
            "created_at",
        ]


class CommentSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)

    class Meta:
        model = Comment
        fields = ["id", "user", "username", "mountain", "body", "created_at"]
        read_only_fields = ["user", "username", "created_at"]


class UserProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)
    email = serializers.EmailField(source="user.email", read_only=True)
    level = serializers.IntegerField(read_only=True)
    rank_title = serializers.CharField(read_only=True)
    next_rank = serializers.SerializerMethodField()

    class Meta:
        model = UserProfile
        fields = ["username", "email", "country", "bio", "experience_points", "level", "rank_title", "next_rank"]

    def get_next_rank(self, obj: UserProfile):
        return obj.next_rank
