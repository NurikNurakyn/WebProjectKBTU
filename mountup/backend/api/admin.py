from django.contrib import admin

from .models import Ascent, Comment, Mountain, UserProfile


@admin.register(Mountain)
class MountainAdmin(admin.ModelAdmin):
	list_display = ("id", "name", "location", "elevation_m", "is_featured", "created_by", "image_url", "wiki_url")
	search_fields = ("name", "location", "created_by__username")
	list_filter = ("is_featured",)


@admin.register(Ascent)
class AscentAdmin(admin.ModelAdmin):
	list_display = ("id", "user", "mountain", "status", "climbed_on")
	search_fields = ("user__username", "mountain__name")
	list_filter = ("status",)


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
	list_display = ("id", "user", "mountain", "created_at")
	search_fields = ("user__username", "mountain__name", "body")


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
	list_display = ("id", "user", "country", "avatar_url", "experience_points")
	search_fields = ("user__username", "country", "avatar_url")
	fields = ("user", "country", "bio", "avatar_url", "experience_points")