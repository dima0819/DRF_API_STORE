from django.urls import path
from .views import CartDetailView, CartItemDetailView, AddCartItemView

urlpatterns = [
    path('', CartDetailView.as_view(), name='my-cart'),
    path('items/<int:pk>/', CartItemDetailView.as_view(), name='cart-item-detail'),
    path('add_item/', AddCartItemView.as_view(), name='add-cart-item'),
]
