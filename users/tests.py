from django.test import TestCase
from rest_framework.test import APIClient

from .models import User


REGISTER_URL = '/api/v1/auth/register/'
TOKEN_URL = '/api/v1/token/'
REFRESH_URL = '/api/v1/token/refresh/'


class RegisterTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.payload = {
            'first_name': 'Jan',
            'last_name': 'Kowalski',
            'email': 'jan@example.com',
            'password': 'SuperTajne123!',
            'phone_number': '+48123456789',
        }

    def test_register_success(self):
        resp = self.client.post(REGISTER_URL, self.payload, format='json')
        self.assertEqual(resp.status_code, 201)
        user = User.objects.get(email='jan@example.com')
        self.assertEqual(user.first_name, 'Jan')
        self.assertEqual(user.phone_number, '+48123456789')
        # username defaults to email when not provided
        self.assertEqual(user.username, 'jan@example.com')
        # password is hashed, not stored in plaintext
        self.assertNotEqual(user.password, self.payload['password'])
        self.assertTrue(user.check_password(self.payload['password']))

    def test_register_duplicate_email_rejected(self):
        self.client.post(REGISTER_URL, self.payload, format='json')
        resp = self.client.post(REGISTER_URL, self.payload, format='json')
        self.assertEqual(resp.status_code, 400)
        self.assertEqual(User.objects.filter(email='jan@example.com').count(), 1)

    def test_register_weak_password_rejected(self):
        payload = dict(self.payload, password='123')
        resp = self.client.post(REGISTER_URL, payload, format='json')
        self.assertEqual(resp.status_code, 400)
        self.assertFalse(User.objects.filter(email='jan@example.com').exists())

    def test_register_requires_phone_number(self):
        payload = dict(self.payload)
        del payload['phone_number']
        resp = self.client.post(REGISTER_URL, payload, format='json')
        self.assertEqual(resp.status_code, 400)


class JWTAuthTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email='login@example.com',
            username='login_user',
            password='SuperTajne123!',
        )

    def test_token_obtain_with_email(self):
        resp = self.client.post(
            TOKEN_URL,
            {'email': 'login@example.com', 'password': 'SuperTajne123!'},
            format='json',
        )
        self.assertEqual(resp.status_code, 200)
        self.assertIn('access', resp.data)
        self.assertIn('refresh', resp.data)

    def test_token_obtain_wrong_password(self):
        resp = self.client.post(
            TOKEN_URL,
            {'email': 'login@example.com', 'password': 'zle-haslo'},
            format='json',
        )
        self.assertEqual(resp.status_code, 401)

    def test_token_refresh(self):
        obtain = self.client.post(
            TOKEN_URL,
            {'email': 'login@example.com', 'password': 'SuperTajne123!'},
            format='json',
        )
        refresh = obtain.data['refresh']
        resp = self.client.post(REFRESH_URL, {'refresh': refresh}, format='json')
        self.assertEqual(resp.status_code, 200)
        self.assertIn('access', resp.data)

    def test_access_token_authenticates_request(self):
        obtain = self.client.post(
            TOKEN_URL,
            {'email': 'login@example.com', 'password': 'SuperTajne123!'},
            format='json',
        )
        access = obtain.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'JWT {access}')
        resp = self.client.get('/api/v1/carts/')
        self.assertEqual(resp.status_code, 200)
