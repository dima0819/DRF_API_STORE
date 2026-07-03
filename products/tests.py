from decimal import Decimal

from django.test import TestCase
from rest_framework.test import APIClient

from users.models import User
from .models import Product, Category


class ProductListTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.category = Category.objects.create(name='Piłki')
        self.other_category = Category.objects.create(name='Rowery')
        self.product = Product.objects.create(
            name='Piłka do piłki nożnej Pro',
            description='Profesjonalna piłka meczowa',
            price=Decimal('89.99'),
            stock=25,
            category=self.category,
        )
        self.other_product = Product.objects.create(
            name='Rower górski Trail X',
            description='Amortyzacja pełna',
            price=Decimal('3299.00'),
            stock=4,
            category=self.other_category,
        )

    def test_list_is_public_and_paginated(self):
        resp = self.client.get('/api/v1/store/')
        self.assertEqual(resp.status_code, 200)
        self.assertIn('results', resp.data)
        self.assertEqual(resp.data['count'], 2)

    def test_polish_category_name_gets_ascii_slug(self):
        self.assertEqual(self.category.slug, 'pilki')

    def test_filter_by_category_slug(self):
        resp = self.client.get('/api/v1/store/', {'category': 'pilki'})
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.data['count'], 1)
        self.assertEqual(resp.data['results'][0]['name'], self.product.name)

    def test_search_by_name(self):
        resp = self.client.get('/api/v1/store/', {'search': 'rower'})
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.data['count'], 1)
        self.assertEqual(resp.data['results'][0]['name'], self.other_product.name)

    def test_ordering_by_price(self):
        resp = self.client.get('/api/v1/store/', {'ordering': '-price'})
        self.assertEqual(resp.status_code, 200)
        prices = [item['price'] for item in resp.data['results']]
        self.assertEqual(prices, ['3299.00', '89.99'])

    def test_detail_returns_product(self):
        resp = self.client.get(f'/api/v1/store/{self.product.id}/')
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.data['name'], self.product.name)
        self.assertEqual(resp.data['category'], self.category.name)

    def test_list_not_stale_after_create(self):
        """New products must be visible immediately (no server-side cache)."""
        resp_before = self.client.get('/api/v1/store/')
        self.assertEqual(resp_before.data['count'], 2)
        Product.objects.create(
            name='Nowy produkt',
            description='d',
            price=Decimal('1.00'),
            stock=1,
            category=self.category,
        )
        resp_after = self.client.get('/api/v1/store/')
        self.assertEqual(resp_after.data['count'], 3)


class ProductCRUDPermissionTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email='user@example.com', username='user', password='pass'
        )
        self.admin = User.objects.create_user(
            email='admin@example.com', username='admin', password='pass', is_staff=True
        )
        self.category = Category.objects.create(name='Fitness')
        self.product = Product.objects.create(
            name='Kettlebell 16 kg',
            description='Odlewany',
            price=Decimal('159.00'),
            stock=20,
            category=self.category,
        )
        self.payload = {
            'name': 'Mata do jogi Premium',
            'description': 'Antypoślizgowa',
            'price': '79.99',
            'stock': 40,
            'category': self.category.name,
        }

    def test_anonymous_cannot_create(self):
        resp = self.client.post('/api/v1/store/', self.payload, format='json')
        self.assertEqual(resp.status_code, 401)

    def test_regular_user_cannot_create(self):
        self.client.force_authenticate(user=self.user)
        resp = self.client.post('/api/v1/store/', self.payload, format='json')
        self.assertEqual(resp.status_code, 403)

    def test_admin_can_create(self):
        self.client.force_authenticate(user=self.admin)
        resp = self.client.post('/api/v1/store/', self.payload, format='json')
        self.assertEqual(resp.status_code, 201)
        self.assertTrue(Product.objects.filter(name=self.payload['name']).exists())

    def test_admin_can_update(self):
        self.client.force_authenticate(user=self.admin)
        resp = self.client.patch(
            f'/api/v1/store/{self.product.id}/',
            {'price': '199.00', 'stock': 7},
            format='json',
        )
        self.assertEqual(resp.status_code, 200)
        self.product.refresh_from_db()
        self.assertEqual(self.product.price, Decimal('199.00'))
        self.assertEqual(self.product.stock, 7)

    def test_regular_user_cannot_update(self):
        self.client.force_authenticate(user=self.user)
        resp = self.client.patch(
            f'/api/v1/store/{self.product.id}/', {'price': '1.00'}, format='json'
        )
        self.assertEqual(resp.status_code, 403)

    def test_admin_can_delete(self):
        self.client.force_authenticate(user=self.admin)
        resp = self.client.delete(f'/api/v1/store/{self.product.id}/')
        self.assertEqual(resp.status_code, 204)
        self.assertFalse(Product.objects.filter(pk=self.product.id).exists())

    def test_negative_price_rejected(self):
        self.client.force_authenticate(user=self.admin)
        payload = dict(self.payload, price='-5.00')
        resp = self.client.post('/api/v1/store/', payload, format='json')
        self.assertEqual(resp.status_code, 400)


class CategoryCRUDTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email='user@example.com', username='user', password='pass'
        )
        self.admin = User.objects.create_user(
            email='admin@example.com', username='admin', password='pass', is_staff=True
        )
        self.category = Category.objects.create(name='Bieganie', description='Buty i akcesoria')

    def test_list_is_public(self):
        resp = self.client.get('/api/v1/store/categories/')
        self.assertEqual(resp.status_code, 200)
        names = [c['name'] for c in resp.data]
        self.assertIn('Bieganie', names)

    def test_detail_returns_category(self):
        resp = self.client.get(f'/api/v1/store/categories/{self.category.id}/')
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.data['slug'], 'bieganie')

    def test_regular_user_cannot_create(self):
        self.client.force_authenticate(user=self.user)
        resp = self.client.post(
            '/api/v1/store/categories/', {'name': 'Sporty zimowe'}, format='json'
        )
        self.assertEqual(resp.status_code, 403)

    def test_admin_can_create_with_auto_slug(self):
        self.client.force_authenticate(user=self.admin)
        resp = self.client.post(
            '/api/v1/store/categories/', {'name': 'Sporty zimowe'}, format='json'
        )
        self.assertEqual(resp.status_code, 201)
        self.assertEqual(resp.data['slug'], 'sporty-zimowe')

    def test_admin_can_update(self):
        self.client.force_authenticate(user=self.admin)
        resp = self.client.patch(
            f'/api/v1/store/categories/{self.category.id}/',
            {'description': 'Nowy opis'},
            format='json',
        )
        self.assertEqual(resp.status_code, 200)
        self.category.refresh_from_db()
        self.assertEqual(self.category.description, 'Nowy opis')

    def test_admin_can_delete(self):
        self.client.force_authenticate(user=self.admin)
        resp = self.client.delete(f'/api/v1/store/categories/{self.category.id}/')
        self.assertEqual(resp.status_code, 204)
        self.assertFalse(Category.objects.filter(pk=self.category.id).exists())
