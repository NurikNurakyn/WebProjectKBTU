from django.db import migrations, models


def _xp_for_elevation(elevation_m: int) -> int:
    if elevation_m >= 8000:
        return 5000
    if elevation_m >= 6000:
        return 1000
    if elevation_m >= 4500:
        return 500
    return 250


def _xp_for_difficulty(difficulty: str) -> int:
    mapping = {
        'beginner': 0,
        'intermediate': 250,
        'advanced': 1000,
        'expert': 5000,
    }
    return mapping.get(difficulty, 0)


def backfill_awarded_xp(apps, schema_editor):
    Ascent = apps.get_model('api', 'Ascent')
    UserProfile = apps.get_model('api', 'UserProfile')

    status_planned = 'planned'
    profiles = {profile.user_id: profile for profile in UserProfile.objects.all()}

    for ascent in Ascent.objects.select_related('mountain').all():
        new_award = 0
        if ascent.status != status_planned:
            new_award = _xp_for_elevation(ascent.mountain.elevation_m) + _xp_for_difficulty(
                ascent.mountain.difficulty
            )

        ascent.awarded_xp = new_award
        ascent.save(update_fields=['awarded_xp'])

        profile = profiles.get(ascent.user_id)
        if profile is None:
            profile = UserProfile.objects.create(user_id=ascent.user_id, experience_points=0)
            profiles[ascent.user_id] = profile
        profile.experience_points += new_award

    for profile in profiles.values():
        profile.save(update_fields=['experience_points'])


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_mountain_image_url'),
    ]

    operations = [
        migrations.AddField(
            model_name='ascent',
            name='awarded_xp',
            field=models.PositiveIntegerField(default=0),
        ),
        migrations.RunPython(backfill_awarded_xp, migrations.RunPython.noop),
    ]
