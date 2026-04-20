from collections import Counter
import re

from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken, TokenError

from .models import Ascent, Comment, Mountain, UserProfile
from .serializers import (
    AscentSerializer,
    CommentSerializer,
    LeaderboardEntrySerializer,
    LoginSerializer,
    LogoutSerializer,
    MountainSerializer,
    RegisterSerializer,
    UserProfileSerializer,
)


def _recommended_level(elevation_m: int, difficulty: str) -> int:
    base_level = 1
    if elevation_m >= 8000:
        base_level = 20
    elif elevation_m >= 6000:
        base_level = 14
    elif elevation_m >= 4500:
        base_level = 9
    elif elevation_m >= 3000:
        base_level = 5

    difficulty_shift = {
        Mountain.DIFFICULTY_BEGINNER: 0,
        Mountain.DIFFICULTY_INTERMEDIATE: 1,
        Mountain.DIFFICULTY_ADVANCED: 2,
        Mountain.DIFFICULTY_EXPERT: 3,
    }
    return base_level + difficulty_shift.get(difficulty, 0)


def _estimated_duration_hours(elevation_m: int, difficulty: str) -> float:
    base_hours = max(elevation_m / 1000, 2)
    multiplier = {
        Mountain.DIFFICULTY_BEGINNER: 1.0,
        Mountain.DIFFICULTY_INTERMEDIATE: 1.2,
        Mountain.DIFFICULTY_ADVANCED: 1.35,
        Mountain.DIFFICULTY_EXPERT: 1.55,
    }
    return round(base_hours * multiplier.get(difficulty, 1.0), 1)


def _build_route_checkpoints(mountain: Mountain):
    duration_hours = _estimated_duration_hours(mountain.elevation_m, mountain.difficulty)
    fractions = [0.2, 0.45, 0.7, 0.9, 1.0]
    names = ["Trailhead", "Forest camp", "Ridge camp", "High camp", "Summit"]

    checkpoints = []
    for index, fraction in enumerate(fractions):
        checkpoints.append(
            {
                "name": names[index],
                "elevation_m": max(int(mountain.elevation_m * fraction), 600),
                "eta_hours": round(duration_hours * fraction, 1),
            }
        )
    return checkpoints


def _gear_checklist(difficulty: str, elevation_m: int):
    mandatory = [
        {"icon": "hiking", "label": "Trekking boots"},
        {"icon": "health_and_safety", "label": "First aid kit"},
        {"icon": "water_drop", "label": "Hydration system"},
    ]
    recommended = [
        {"icon": "map", "label": "Offline map"},
        {"icon": "wb_sunny", "label": "UV protection"},
    ]

    if elevation_m >= 4500:
        mandatory.append({"icon": "ac_unit", "label": "Insulated jacket"})
    if elevation_m >= 6000:
        mandatory.append({"icon": "construction", "label": "Crampons and helmet"})
    if elevation_m >= 8000:
        mandatory.append({"icon": "air", "label": "Supplemental oxygen system"})

    if difficulty in (Mountain.DIFFICULTY_ADVANCED, Mountain.DIFFICULTY_EXPERT):
        recommended.append({"icon": "military_tech", "label": "Technical climbing set"})
    if difficulty == Mountain.DIFFICULTY_EXPERT:
        recommended.append({"icon": "satellite_alt", "label": "Satellite communicator"})

    return {"mandatory": mandatory, "recommended": recommended}


def _common_comment_themes(comments: list[Comment]):
    stop_words = {
        "the",
        "and",
        "for",
        "with",
        "this",
        "that",
        "very",
        "good",
        "great",
        "was",
        "were",
        "from",
        "have",
        "has",
        "you",
        "your",
        "our",
        "are",
    }
    all_words: list[str] = []
    for comment in comments:
        all_words.extend(re.findall(r"[a-zA-Z]{4,}", comment.body.lower()))

    filtered_words = [word for word in all_words if word not in stop_words]
    return [word for word, _ in Counter(filtered_words).most_common(3)]


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = User.objects.create_user(
            username=serializer.validated_data["username"],
            email=serializer.validated_data["email"],
            password=serializer.validated_data["password"],
            first_name=serializer.validated_data.get("full_name", ""),
        )
        UserProfile.objects.create(
            user=user,
            country=serializer.validated_data.get("country", ""),
        )

        return Response(
            {
                "id": user.id,
                "username": user.username,
                "email": user.email,
            },
            status=status.HTTP_201_CREATED,
        )


class MountainListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.request.method == "GET":
            return [AllowAny()]
        return super().get_permissions()

    def get(self, request):
        mountains = Mountain.objects.all()
        serializer = MountainSerializer(mountains, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = MountainSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(created_by=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class MountainDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.request.method == "GET":
            return [AllowAny()]
        return super().get_permissions()

    def get_object(self, pk: int):
        try:
            return Mountain.objects.get(pk=pk)
        except Mountain.DoesNotExist:
            return None

    def get(self, request, pk: int):
        mountain = self.get_object(pk)
        if mountain is None:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)

        ascents = list(mountain.ascents.select_related("user").all())
        completed_ascents = [ascent for ascent in ascents if ascent.status != Ascent.STATUS_PLANNED]
        comments = list(mountain.comments.select_related("user").all())

        base_xp = Ascent.xp_for_elevation(mountain.elevation_m)
        difficulty_xp = Ascent.xp_for_difficulty(mountain.difficulty)
        total_xp_reward = base_xp + difficulty_xp

        difficulty_rating = {
            Mountain.DIFFICULTY_BEGINNER: 2.0,
            Mountain.DIFFICULTY_INTERMEDIATE: 3.0,
            Mountain.DIFFICULTY_ADVANCED: 4.0,
            Mountain.DIFFICULTY_EXPERT: 5.0,
        }.get(mountain.difficulty, 2.5)

        payload = MountainSerializer(mountain).data
        payload["progress_and_rewards"] = {
            "xp_reward": total_xp_reward,
            "recommended_level": _recommended_level(mountain.elevation_m, mountain.difficulty),
            "difficulty_badge": mountain.get_difficulty_display(),
            "estimated_duration_hours": _estimated_duration_hours(mountain.elevation_m, mountain.difficulty),
        }
        payload["safety_panel"] = {
            "weather_window": "06:00-11:00 (stable winds)",
            "avalanche_risk": "Moderate" if mountain.elevation_m >= 4500 else "Low",
            "last_update": mountain.updated_at,
        }
        payload["route_checkpoints"] = _build_route_checkpoints(mountain)
        payload["gear_checklist"] = _gear_checklist(mountain.difficulty, mountain.elevation_m)
        payload["community_stats"] = {
            "ascents_count": len(ascents),
            "completed_ascents_count": len(completed_ascents),
            "average_difficulty_rating": difficulty_rating,
            "common_comment_themes": _common_comment_themes(comments),
            "recent_comments": [
                {
                    "username": comment.user.username,
                    "body": comment.body,
                    "created_at": comment.created_at,
                }
                for comment in comments[:3]
            ],
        }

        return Response(payload)

    def put(self, request, pk: int):
        mountain = self.get_object(pk)
        if mountain is None:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
        if mountain.created_by != request.user:
            return Response({"detail": "You can edit only your own mountains."}, status=status.HTTP_403_FORBIDDEN)

        serializer = MountainSerializer(mountain, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(created_by=request.user)
        return Response(serializer.data)

    def delete(self, request, pk: int):
        mountain = self.get_object(pk)
        if mountain is None:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
        if mountain.created_by != request.user:
            return Response({"detail": "You can delete only your own mountains."}, status=status.HTTP_403_FORBIDDEN)
        mountain.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class AscentListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        ascents = Ascent.objects.filter(user=request.user)
        serializer = AscentSerializer(ascents, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = AscentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class CommentListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.request.method == "GET":
            return [AllowAny()]
        return super().get_permissions()

    def get(self, request):
        mountain_id = request.query_params.get("mountain")
        comments = Comment.objects.all()
        if mountain_id:
            comments = comments.filter(mountain_id=mountain_id)
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = CommentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(["POST"])
@permission_classes([AllowAny])
def login_view(request):
    serializer = LoginSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    user = authenticate(
        username=serializer.validated_data["username"],
        password=serializer.validated_data["password"],
    )
    if user is None:
        return Response({"error": "Invalid credentials."}, status=status.HTTP_400_BAD_REQUEST)

    profile, _ = UserProfile.objects.get_or_create(user=user)
    refresh = RefreshToken.for_user(user)
    return Response(
        {
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "avatar_url": profile.avatar_url,
            },
        }
    )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def logout_view(request):
    serializer = LogoutSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    try:
        token = RefreshToken(serializer.validated_data["refresh"])
        token.blacklist()
    except TokenError:
        return Response({"error": "Invalid refresh token."}, status=status.HTTP_400_BAD_REQUEST)

    return Response({"message": "Logged out successfully."})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def profile_view(request):
    profile, _ = UserProfile.objects.get_or_create(user=request.user)
    serializer = UserProfileSerializer(profile)
    user_ascents = request.user.ascents.select_related("mountain")

    completed_ascents = [ascent for ascent in user_ascents if ascent.status != Ascent.STATUS_PLANNED]
    total_elevation = sum(ascent.mountain.elevation_m for ascent in completed_ascents)
    highest_ascent = max(completed_ascents, key=lambda ascent: ascent.mountain.elevation_m, default=None)
    eight_thousanders_count = sum(1 for ascent in completed_ascents if ascent.mountain.elevation_m >= 8000)
    challenging_count = sum(1 for ascent in completed_ascents if ascent.mountain.elevation_m >= 6000)
    medium_count = sum(
        1 for ascent in completed_ascents if 4500 <= ascent.mountain.elevation_m < 6000
    )
    easy_count = sum(1 for ascent in completed_ascents if ascent.mountain.elevation_m < 4500)
    recent_ascent = completed_ascents[0] if completed_ascents else None

    payload = serializer.data
    payload["ascents_count"] = request.user.ascents.count()
    payload["completed_ascents_count"] = len(completed_ascents)
    payload["total_elevation_climbed_m"] = total_elevation
    payload["highest_mountain"] = (
        {
            "name": highest_ascent.mountain.name,
            "elevation_m": highest_ascent.mountain.elevation_m,
        }
        if highest_ascent
        else None
    )
    payload["recent_ascent"] = (
        {
            "mountain_name": recent_ascent.mountain.name,
            "elevation_m": recent_ascent.mountain.elevation_m,
            "climbed_on": recent_ascent.climbed_on,
            "awarded_xp": recent_ascent.awarded_xp,
        }
        if recent_ascent
        else None
    )
    payload["ascent_breakdown"] = {
        "under_4500": easy_count,
        "from_4500_to_5999": medium_count,
        "from_6000_to_7999": max(challenging_count - eight_thousanders_count, 0),
        "over_or_equal_8000": eight_thousanders_count,
    }
    return Response(payload)


@api_view(["GET"])
@permission_classes([AllowAny])
def leaderboard_view(request):
    profiles = UserProfile.objects.select_related("user").order_by("-experience_points", "user__username")
    serializer = LeaderboardEntrySerializer(profiles, many=True)
    return Response(serializer.data)