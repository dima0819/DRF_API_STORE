from decimal import Decimal

from django.test import TestCase
from rest_framework.test import APIClient

from users.models import User
from products.models import Product, Category
from .models import CartItem


class AddCartItemTests(TestCase):
	def setUp(self):
		self.client = APIClient()
		self.user = User.objects.create_user(email='a@example.com', username='user1', password='pass')
		self.category = Category.objects.create(name='cat')
		self.product = Product.objects.create(
			name='Prod', description='d', price=Decimal('10.00'), category=self.category
		)

	def test_add_item_creates_cartitem(self):
		self.client.force_authenticate(user=self.user)
		data = {'product_id': self.product.id, 'quantity': 2}
		resp = self.client.post('/api/v1/cart/add_item/', data, format='json')
		self.assertEqual(resp.status_code, 201)
		self.assertEqual(resp.data['product']['id'], self.product.id)
		self.assertEqual(resp.data['quantity'], 2)
		self.assertTrue(CartItem.objects.filter(cart__user=self.user, product=self.product).exists())

	def test_adding_same_product_increments_quantity(self):
		self.client.force_authenticate(user=self.user)
		self.client.post('/api/v1/cart/add_item/', {'product_id': self.product.id, 'quantity': 2}, format='json')
		resp = self.client.post('/api/v1/cart/add_item/', {'product_id': self.product.id, 'quantity': 3}, format='json')
		self.assertEqual(resp.status_code, 201)
		self.assertEqual(resp.data['quantity'], 5)

	def test_invalid_product_returns_400(self):
		self.client.force_authenticate(user=self.user)
		resp = self.client.post('/api/v1/cart/add_item/', {'product_id': 99999, 'quantity': 1}, format='json')
		self.assertEqual(resp.status_code, 400)
