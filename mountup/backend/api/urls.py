from django.urls import path
from .views import (
    AscentListCreateView,
    CommentListCreateView,
    MountainDetailView,
    MountainListCreateView,
    RegisterView,
    leaderboard_view,
    login_view,
    logout_view,
    profile_view,
)

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", login_view, name="login"),
    path("logout/", logout_view, name="logout"),
    path("profile/", profile_view, name="profile"),
    path("leaderboard/", leaderboard_view, name="leaderboard"),
    path("mountains/", MountainListCreateView.as_view(), name="mountain-list-create"),
    path("mountains/<int:pk>/", MountainDetailView.as_view(), name="mountain-detail"),
    path("ascents/", AscentListCreateView.as_view(), name="ascent-list-create"),
    path("comments/", CommentListCreateView.as_view(), name="comment-list-create"),
]