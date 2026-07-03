from django.db import migrations
from django.utils.text import slugify


def fix_slugs(apps, schema_editor):
    """Re-slugify categories so Polish 'ł' becomes 'l' ("Piłki" -> "pilki")."""
    Category = apps.get_model('products', 'Category')
    for category in Category.objects.all():
        ascii_name = category.name.replace('ł', 'l').replace('Ł', 'L')
        new_slug = slugify(ascii_name)[:50]
        if not new_slug or new_slug == category.slug:
            continue
        base = new_slug[:45]
        counter = 2
        while Category.objects.filter(slug=new_slug).exclude(pk=category.pk).exists():
            new_slug = f"{base}-{counter}"
            counter += 1
        category.slug = new_slug
        category.save(update_fields=['slug'])


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0004_remove_product_slug_category_slug'),
    ]

    operations = [
        migrations.RunPython(fix_slugs, migrations.RunPython.noop),
    ]
