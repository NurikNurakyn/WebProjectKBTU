from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0005_mountain_wiki_url"),
    ]

    operations = [
        migrations.AddField(
            model_name="userprofile",
            name="avatar_url",
            field=models.URLField(blank=True),
        ),
    ]
