from decimal import Decimal

from django.core.management.base import BaseCommand

from products.models import Category, Product


CATEGORIES = [
    {
        "name": "Piłki",
        "description": "Piłki do piłki nożnej, koszykówki, siatkówki i innych dyscyplin.",
        "products": [
            ("Piłka do piłki nożnej Pro", "Profesjonalna piłka meczowa, rozmiar 5, wodoodporna.", "89.99", 25),
            ("Piłka do koszykówki Street", "Piłka do gry na ulicy, wytrzymała gumowa powierzchnia.", "129.00", 18),
            ("Piłka do siatkówki Beach", "Lekka piłka plażowa, idealna na lato.", "69.50", 30),
        ],
    },
    {
        "name": "Sztangi",
        "description": "Sztangi, hantle i akcesoria do treningu siłowego.",
        "products": [
            ("Sztanga olimpijska 20 kg", "Stalowa sztanga olimpijska z łożyskami, długość 220 cm.", "449.00", 12),
            ("Hantle regulowane 2x20 kg", "Para hantli z możliwością regulacji obciążenia.", "599.00", 8),
            ("Gryf prosty 180 cm", "Gryf prosty do ćwiczeń na ławce, max obciążenie 200 kg.", "199.00", 15),
        ],
    },
    {
        "name": "Fitness",
        "description": "Mata, taśmy oporowe, kettlebell i sprzęt do ćwiczeń w domu.",
        "products": [
            ("Mata do jogi Premium", "Antypoślizgowa mata 6 mm, z torbą transportową.", "79.99", 40),
            ("Zestaw taśm oporowych", "5 taśm o różnej grubości z uchwytami i kotwami.", "119.00", 22),
            ("Kettlebell 16 kg", "Odlewany żeliwo, ergonomiczny uchwyt.", "159.00", 20),
        ],
    },
    {
        "name": "Sporty zimowe",
        "description": "Sprzęt na stok — narty, snowboard, kijki i akcesoria.",
        "products": [
            ("Narty zjazdowe All-Mountain", "Narty uniwersalne 170 cm, dla średniozaawansowanych.", "1899.00", 6),
            ("Snowboard Freestyle 155", "Deska do parku z symetrycznym kształtem.", "1499.00", 5),
            ("Kijki narciarskie Carbon", "Lekkie kijki z regulacją długości.", "249.00", 14),
        ],
    },
    {
        "name": "Rowery",
        "description": "Rowery szosowe, górskie i miejskie oraz akcesoria.",
        "products": [
            ("Rower górski Trail X", "Amortyzacja pełna, przerzutka 21-biegowa.", "3299.00", 4),
            ("Rower szosowy Aero", "Lekka rama aluminiowa, idealny na długie trasy.", "4599.00", 3),
            ("Kask rowerowy Pro", "Kask z systemem wentylacji MIPS.", "299.00", 35),
        ],
    },
    {
        "name": "Bieganie",
        "description": "Buty, odzież i akcesoria dla biegaczy.",
        "products": [
            ("Buty do biegania Sprint", "Amortyzacja żelowa, lekka cholewka mesh.", "449.00", 28),
            ("Opaska na ramię z bidonem", "Elastyczna opaska na telefon i bidon 500 ml.", "59.00", 50),
            ("Zegarek sportowy GPS", "Pulsometr, GPS, wodoodporność 5 ATM.", "899.00", 10),
        ],
    },
]


class Command(BaseCommand):
    help = "Seed sports store categories and products"

    def handle(self, *args, **options):
        created_products = 0
        for cat_data in CATEGORIES:
            category, _ = Category.objects.get_or_create(
                name=cat_data["name"],
                defaults={"description": cat_data["description"]},
            )
            if not category.description:
                category.description = cat_data["description"]
                category.save()

            for name, description, price, stock in cat_data["products"]:
                _, created = Product.objects.get_or_create(
                    name=name,
                    category=category,
                    defaults={
                        "description": description,
                        "price": Decimal(price),
                        "stock": stock,
                    },
                )
                if created:
                    created_products += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"Seed complete. Categories: {Category.objects.count()}, "
                f"Products: {Product.objects.count()} ({created_products} new)."
            )
        )
