from unittest.mock import patch

from django.test import TestCase

from users.models import User
from .models import Order
from .tasks import send_order_confirmation_email


class SendOrderConfirmationEmailTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='task@example.com', username='task_user', password='pass123'
        )
        self.order = Order.objects.create(user=self.user, address='Test address')

    @patch('order.tasks.send_mail')
    def test_send_order_confirmation_email_calls_send_mail(self, mock_send_mail):
        mock_send_mail.return_value = 1

        # call the underlying task function (bypass Celery machinery)
        result = send_order_confirmation_email.run(self.order.id, self.user.email)

        mock_send_mail.assert_called_once()
        args, kwargs = mock_send_mail.call_args
        subject, message, email_from, recipient_list = args

        # subject should include order id
        self.assertIn(str(self.order.id), subject)
        # recipient list must contain user email
        self.assertEqual(recipient_list, [self.user.email])
        # message should contain the address
        self.assertIn('Test address', message)
        # function should return success string
        self.assertEqual(result, f"Email for {self.user.email} sent!")
