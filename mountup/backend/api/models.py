from django.conf import settings
from django.db import models


class MountainQuerySet(models.QuerySet):
	def featured(self):
		return self.filter(is_featured=True)


class Mountain(models.Model):
	name = models.CharField(max_length=120)
	location = models.CharField(max_length=160)
	image_url = models.URLField(blank=True)
	elevation_m = models.PositiveIntegerField()
	difficulty = models.CharField(max_length=64)
	description = models.TextField(blank=True)
	is_featured = models.BooleanField(default=False)
	created_by = models.ForeignKey(
		settings.AUTH_USER_MODEL,
		on_delete=models.CASCADE,
		related_name="mountains",
	)
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	objects = MountainQuerySet.as_manager()

	class Meta:
		ordering = ["-created_at"]

	def __str__(self) -> str:
		return self.name


class UserProfile(models.Model):
	RANK_RULES = (
		(0, "Novice"),
		(500, "Tourist"),
		(1200, "Amateur"),
		(2500, "Path Finder"),
		(4500, "Summit Seeker"),
		(7000, "Alpine Master"),
	)

	user = models.OneToOneField(
		settings.AUTH_USER_MODEL,
		on_delete=models.CASCADE,
		related_name="profile",
	)
	country = models.CharField(max_length=80, blank=True)
	bio = models.TextField(blank=True)
	experience_points = models.PositiveIntegerField(default=0)

	@property
	def level(self) -> int:
		return (self.experience_points // 500) + 1

	@property
	def rank_title(self) -> str:
		current_rank = self.RANK_RULES[0][1]
		for threshold, title in self.RANK_RULES:
			if self.experience_points >= threshold:
				current_rank = title
		return current_rank

	@property
	def next_rank(self) -> dict | None:
		for threshold, title in self.RANK_RULES:
			if self.experience_points < threshold:
				return {
					"title": title,
					"threshold": threshold,
					"points_left": threshold - self.experience_points,
				}
		return None

	def __str__(self) -> str:
		return f"Profile<{self.user.username}>"


class Ascent(models.Model):
	STATUS_PENDING = "pending"
	STATUS_CONFIRMED = "confirmed"
	STATUS_PLANNED = "planned"

	STATUS_CHOICES = (
		(STATUS_PENDING, "Pending"),
		(STATUS_CONFIRMED, "Confirmed"),
		(STATUS_PLANNED, "Planned"),
	)

	user = models.ForeignKey(
		settings.AUTH_USER_MODEL,
		on_delete=models.CASCADE,
		related_name="ascents",
	)
	mountain = models.ForeignKey(
		Mountain,
		on_delete=models.CASCADE,
		related_name="ascents",
	)
	climbed_on = models.DateField()
	notes = models.TextField(blank=True)
	status = models.CharField(max_length=16, choices=STATUS_CHOICES, default=STATUS_PENDING)
	created_at = models.DateTimeField(auto_now_add=True)

	class Meta:
		ordering = ["-climbed_on", "-id"]

	def __str__(self) -> str:
		return f"{self.user.username} -> {self.mountain.name}"


class Comment(models.Model):
	user = models.ForeignKey(
		settings.AUTH_USER_MODEL,
		on_delete=models.CASCADE,
		related_name="comments",
	)
	mountain = models.ForeignKey(
		Mountain,
		on_delete=models.CASCADE,
		related_name="comments",
	)
	body = models.TextField()
	created_at = models.DateTimeField(auto_now_add=True)

	class Meta:
		ordering = ["-created_at"]

	def __str__(self) -> str:
		return f"Comment<{self.user.username} @ {self.mountain.name}>"