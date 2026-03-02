from decimal import Decimal

from django.test import TestCase
from rest_framework.test import APIClient

from users.models import User
from products.models import Product, Category
from cart.models import Cart, CartItem
from .models import Order, OrderItem


class OrderCreateTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email='order@example.com',
            username='order_user',
            password='pass123'
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

    def _auth(self):
        self.client.force_authenticate(user=self.user)

    def test_create_order_success_and_stock_decreased_and_cart_cleared(self):
        self._auth()
        # user has 2 units of product, stock = 5
        CartItem.objects.create(cart=self.cart, product=self.product, quantity=2)

        resp = self.client.post(
            '/api/v1/orders/order_create/',
            {'address': 'Test address'},
            format='json',
        )

        self.assertEqual(resp.status_code, 201)
        # order created
        self.assertEqual(Order.objects.filter(user=self.user).count(), 1)
        order = Order.objects.get(user=self.user)
        # created 1 OrderItem
        self.assertEqual(order.items.count(), 1)
        item = order.items.first()
        self.assertEqual(item.quantity, 2)
        # stock decreased from 5 to 3
        self.product.refresh_from_db()
        self.assertEqual(self.product.stock, 3)
        # cart cleared
        self.assertFalse(self.cart.items.exists())

    def test_create_order_fails_when_cart_empty(self):
        self._auth()
        # no items in cart
        resp = self.client.post(
            '/api/v1/orders/order_create/',
            {'address': 'Test address'},
            format='json',
        )

        self.assertEqual(resp.status_code, 400)
        self.assertIn('Cart is empty', str(resp.data))
        self.assertEqual(Order.objects.filter(user=self.user).count(), 0)

    def test_create_order_fails_when_stock_not_enough(self):
        self._auth()
        # in cart user wants 10 units, and stock = 5
        CartItem.objects.create(cart=self.cart, product=self.product, quantity=10)

        resp = self.client.post(
            '/api/v1/orders/order_create/',
            {'address': 'Test address'},
            format='json',
        )

        self.assertEqual(resp.status_code, 400)
        self.assertIn('stock is not enough', str(resp.data))
        # order should not be created
        self.assertEqual(Order.objects.filter(user=self.user).count(), 0)
        # stock of product should not change
        self.product.refresh_from_db()
        self.assertEqual(self.product.stock, 5)


class OrderListAndDetailTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email='user1@example.com',
            username='user1',
            password='pass123'
        )
        self.other_user = User.objects.create_user(
            email='user2@example.com',
            username='user2',
            password='pass123'
        )
        self.category = Category.objects.create(name='cat')
        self.product = Product.objects.create(
            name='Prod',
            description='d',
            price=Decimal('10.00'),
            stock=10,
            category=self.category,
        )
        # order for self.user
        self.order = Order.objects.create(user=self.user, address='addr')
        OrderItem.objects.create(
            order=self.order,
            product=self.product,
            quantity=2,
            price=self.product.price,
        )
        # order for other_user (should not be visible)
        self.other_order = Order.objects.create(user=self.other_user, address='addr2')

    def _auth(self, user):
        self.client.force_authenticate(user=user)

    def test_order_list_returns_only_user_orders(self):
        self._auth(self.user)

        resp = self.client.get('/api/v1/orders/order_list/')

        self.assertEqual(resp.status_code, 200)
        # only 1 order belongs to self.user
        self.assertEqual(len(resp.data), 1)
        self.assertEqual(resp.data[0]['id'], self.order.id)

    def test_order_detail_returns_items_and_total(self):
        self._auth(self.user)

        resp = self.client.get(f'/api/v1/orders/order_detail/{self.order.id}/')

        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.data['id'], self.order.id)
        # check items structure
        self.assertIn('items', resp.data)
        self.assertEqual(len(resp.data['items']), 1)
        item = resp.data['items'][0]
        self.assertEqual(item['product_name'], self.product.name)
        self.assertEqual(item['quantity'], 2)
        # total_order_price should be 2 * 10.00 = 20.00
        self.assertEqual(str(resp.data['total_order_price']), '20.00')

    def test_user_cannot_access_other_users_order_detail(self):
        self._auth(self.user)

        resp = self.client.get(f'/api/v1/orders/order_detail/{self.other_order.id}/')

        # queryset in view filters by user, so we should get 404, not foreign order
        self.assertEqual(resp.status_code, 404)
