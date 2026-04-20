from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_mountain_difficulty_choices'),
    ]

    operations = [
        migrations.AddField(
            model_name='mountain',
            name='wiki_url',
            field=models.URLField(blank=True),
        ),
    ]
