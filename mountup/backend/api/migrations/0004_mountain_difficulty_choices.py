from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_ascent_awarded_xp'),
    ]

    operations = [
        migrations.AlterField(
            model_name='mountain',
            name='difficulty',
            field=models.CharField(
                choices=[
                    ('beginner', 'Beginner'),
                    ('intermediate', 'Intermediate'),
                    ('advanced', 'Advanced'),
                    ('expert', 'Expert'),
                ],
                max_length=16,
            ),
        ),
    ]
