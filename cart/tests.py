from decimal import Decimal

from django.test import TestCase
from rest_framework.test import APIClient

from users.models import User
from products.models import Product, Category
from .models import Cart, CartItem


class CartRetrieveTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email='cart@example.com',
            username='cart_user',
            password='pass',
        )
        self.category = Category.objects.create(name='cat')
        self.product = Product.objects.create(
            name='Prod',
            description='d',
            price=Decimal('10.00'),
            stock=10,
            category=self.category,
        )

    def test_get_cart_requires_auth(self):
        resp = self.client.get('/api/v1/carts/')
        self.assertEqual(resp.status_code, 401)

    def test_get_cart_returns_single_object_not_list(self):
        """Frontend expects {id, items, total_cart_price}, not a list."""
        self.client.force_authenticate(user=self.user)
        resp = self.client.get('/api/v1/carts/')
        self.assertEqual(resp.status_code, 200)
        self.assertIn('items', resp.data)
        self.assertIn('total_cart_price', resp.data)
        self.assertEqual(resp.data['items'], [])

    def test_get_cart_creates_cart_when_missing(self):
        self.client.force_authenticate(user=self.user)
        self.assertFalse(Cart.objects.filter(user=self.user).exists())
        resp = self.client.get('/api/v1/carts/')
        self.assertEqual(resp.status_code, 200)
        self.assertTrue(Cart.objects.filter(user=self.user).exists())

    def test_cart_reflects_added_item_immediately(self):
        """Regression: the cart endpoint must never serve a stale cached copy."""
        self.client.force_authenticate(user=self.user)
        self.client.get('/api/v1/carts/')  # warm any cache

        self.client.post(
            '/api/v1/carts/add_item/',
            {'product_id': self.product.id, 'quantity': 2},
            format='json',
        )
        resp = self.client.get('/api/v1/carts/')
        self.assertEqual(len(resp.data['items']), 1)
        self.assertEqual(resp.data['items'][0]['quantity'], 2)
        self.assertEqual(str(resp.data['total_cart_price']), '20.00')

    def test_users_get_their_own_cart(self):
        other = User.objects.create_user(
            email='other@example.com', username='other', password='pass'
        )
        self.client.force_authenticate(user=self.user)
        self.client.post(
            '/api/v1/carts/add_item/',
            {'product_id': self.product.id, 'quantity': 3},
            format='json',
        )

        self.client.force_authenticate(user=other)
        resp = self.client.get('/api/v1/carts/')
        self.assertEqual(resp.data['items'], [])


class CartItemUpdateDeleteTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email='items@example.com',
            username='items_user',
            password='pass',
        )
        self.category = Category.objects.create(name='cat')
        self.product = Product.objects.create(
            name='Prod',
            description='d',
            price=Decimal('10.00'),
            stock=5,
            category=self.category,
        )
        self.cart = Cart.objects.create(user=self.user)
        self.item = CartItem.objects.create(
            cart=self.cart, product=self.product, quantity=2
        )
        self.client.force_authenticate(user=self.user)

    def test_patch_updates_quantity(self):
        resp = self.client.patch(
            f'/api/v1/carts/items/{self.item.id}/', {'quantity': 4}, format='json'
        )
        self.assertEqual(resp.status_code, 200)
        self.item.refresh_from_db()
        self.assertEqual(self.item.quantity, 4)

    def test_patch_rejects_zero_quantity(self):
        resp = self.client.patch(
            f'/api/v1/carts/items/{self.item.id}/', {'quantity': 0}, format='json'
        )
        self.assertEqual(resp.status_code, 400)

    def test_delete_removes_item(self):
        resp = self.client.delete(f'/api/v1/carts/items/{self.item.id}/')
        self.assertEqual(resp.status_code, 204)
        self.assertFalse(CartItem.objects.filter(pk=self.item.id).exists())

    def test_add_item_exceeding_stock_rejected(self):
        resp = self.client.post(
            '/api/v1/carts/add_item/',
            {'product_id': self.product.id, 'quantity': 6},
            format='json',
        )
        self.assertEqual(resp.status_code, 400)

    def test_increment_beyond_stock_rejected(self):
        # 2 already in cart, stock is 5 -> adding 4 more would exceed it
        resp = self.client.post(
            '/api/v1/carts/add_item/',
            {'product_id': self.product.id, 'quantity': 4},
            format='json',
        )
        self.assertEqual(resp.status_code, 400)
        self.item.refresh_from_db()
        self.assertEqual(self.item.quantity, 2)


class AddCartItemTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email='a@example.com',
            username='user1',
            password='pass',
        )
        self.category = Category.objects.create(name='cat')
        self.product = Product.objects.create(
            name='Prod',
            description='d',
            price=Decimal('10.00'),
            stock=10,
            category=self.category,
        )

    def test_add_item_creates_cartitem(self):
        self.client.force_authenticate(user=self.user)
        data = {'product_id': self.product.id, 'quantity': 2}
        resp = self.client.post('/api/v1/carts/add_item/', data, format='json')
        self.assertEqual(resp.status_code, 201)
        self.assertEqual(resp.data['product']['id'], self.product.id)
        self.assertEqual(resp.data['quantity'], 2)
        self.assertTrue(
            CartItem.objects.filter(
                cart__user=self.user, product=self.product
            ).exists()
        )

    def test_adding_same_product_increments_quantity(self):
        self.client.force_authenticate(user=self.user)
        self.client.post(
            '/api/v1/carts/add_item/',
            {'product_id': self.product.id, 'quantity': 2},
            format='json',
        )
        resp = self.client.post(
            '/api/v1/carts/add_item/',
            {'product_id': self.product.id, 'quantity': 3},
            format='json',
        )
        self.assertEqual(resp.status_code, 201)
        self.assertEqual(resp.data['quantity'], 5)

    def test_invalid_product_returns_400(self):
        self.client.force_authenticate(user=self.user)
        resp = self.client.post(
            '/api/v1/carts/add_item/',
            {'product_id': 99999, 'quantity': 1},
            format='json',
        )
        self.assertEqual(resp.status_code, 400)


class CartPermissionsTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user1 = User.objects.create_user(
            email='u1@example.com',
            username='user1',
            password='pass',
        )
        self.user2 = User.objects.create_user(
            email='u2@example.com',
            username='user2',
            password='pass',
        )
        self.category = Category.objects.create(name='cat')
        self.product = Product.objects.create(
            name='Prod',
            description='d',
            price=Decimal('10.00'),
            category=self.category,
        )

    def test_other_user_cannot_see_cart_items_detail(self):
        # user1 adds item to cart
        self.client.force_authenticate(user=self.user1)
        resp = self.client.post(
            '/api/v1/carts/add_item/',
            {'product_id': self.product.id, 'quantity': 1},
            format='json',
        )
        self.assertEqual(resp.status_code, 201)
        cart_item_id = resp.data['id']

        # user2 tries to access the same cart item
        self.client.force_authenticate(user=self.user2)
        resp2 = self.client.get(f'/api/v1/carts/items/{cart_item_id}/')

        self.assertEqual(resp2.status_code, 404)
