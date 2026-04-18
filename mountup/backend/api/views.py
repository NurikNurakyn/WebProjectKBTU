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
    LoginSerializer,
    LogoutSerializer,
    MountainSerializer,
    RegisterSerializer,
    UserProfileSerializer,
)


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
        return Response(MountainSerializer(mountain).data)

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

    refresh = RefreshToken.for_user(user)
    return Response(
        {
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
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

    payload = serializer.data
    payload["ascents_count"] = request.user.ascents.count()
    return Response(payload)