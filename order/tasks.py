from celery import shared_task
from .models import Order
from django.core.mail import send_mail
from django.conf import settings

@shared_task
def send_order_confirmation_email(order_id, customer_email):
    order_address = Order.objects.get(id=order_id).address
    subject = f'Order №{order_id} confirmed!'
    message = f'''Thank you for your purchase! Your order №{order_id} is now being processed.
    We will notify you once it is ready for shipment.
    If you have any questions, feel free to contact our support team. <support@example.com >
    
    Adress: {order_address}'''
    email_from = settings.EMAIL_HOST_USER
    recipient_list = [customer_email]

    send_mail(subject, message, email_from, recipient_list)
    
    return f"Email for {customer_email} sent!"

        