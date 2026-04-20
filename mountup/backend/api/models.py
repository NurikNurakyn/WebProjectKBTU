from django.conf import settings
from django.db import models


class MountainQuerySet(models.QuerySet):
	def featured(self):
		return self.filter(is_featured=True)


class Mountain(models.Model):
	DIFFICULTY_BEGINNER = "beginner"
	DIFFICULTY_INTERMEDIATE = "intermediate"
	DIFFICULTY_ADVANCED = "advanced"
	DIFFICULTY_EXPERT = "expert"

	DIFFICULTY_CHOICES = (
		(DIFFICULTY_BEGINNER, "Beginner"),
		(DIFFICULTY_INTERMEDIATE, "Intermediate"),
		(DIFFICULTY_ADVANCED, "Advanced"),
		(DIFFICULTY_EXPERT, "Expert"),
	)

	name = models.CharField(max_length=120)
	location = models.CharField(max_length=160)
	image_url = models.URLField(blank=True)
	elevation_m = models.PositiveIntegerField()
	difficulty = models.CharField(max_length=16, choices=DIFFICULTY_CHOICES)
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
		(2000, "Amateur"),
		(4500, "Pro Climber"),
		(7000, "Master Alpinist"),
		(9500, "Sky Sovereign"),
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
	awarded_xp = models.PositiveIntegerField(default=0)

	class Meta:
		ordering = ["-climbed_on", "-id"]

	@staticmethod
	def xp_for_elevation(elevation_m: int) -> int:
		if elevation_m >= 8000:
			return 5000
		if elevation_m >= 6000:
			return 1000
		if elevation_m >= 4500:
			return 500
		return 250

	@staticmethod
	def xp_for_difficulty(difficulty: str) -> int:
		difficulty_bonus = {
			Mountain.DIFFICULTY_BEGINNER: 0,
			Mountain.DIFFICULTY_INTERMEDIATE: 250,
			Mountain.DIFFICULTY_ADVANCED: 1000,
			Mountain.DIFFICULTY_EXPERT: 5000,
		}
		return difficulty_bonus.get(difficulty, 0)

	def _is_xp_eligible(self) -> bool:
		return self.status != self.STATUS_PLANNED

	def save(self, *args, **kwargs):
		is_new = self.pk is None
		previous = None
		if not is_new:
			previous = Ascent.objects.select_related("mountain").get(pk=self.pk)

		super().save(*args, **kwargs)

		profile, _ = UserProfile.objects.get_or_create(user=self.user)
		new_award = 0
		if self._is_xp_eligible():
			new_award = self.xp_for_elevation(self.mountain.elevation_m) + self.xp_for_difficulty(
				self.mountain.difficulty
			)
		old_award = previous.awarded_xp if previous else 0

		if new_award == old_award:
			return

		delta = new_award - old_award
		profile.experience_points = max(0, profile.experience_points + delta)
		profile.save(update_fields=["experience_points"])

		self.awarded_xp = new_award
		type(self).objects.filter(pk=self.pk).update(awarded_xp=new_award)

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