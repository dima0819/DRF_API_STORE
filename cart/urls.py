from django.urls import path
from .views import CartListCreateView, CartItemDetailView, AddCartItemView

urlpatterns = [
    path('', CartListCreateView.as_view(), name='cart-list'),
    path('details/<int:pk>/', CartItemDetailView.as_view(), name='cart-detail'),
    path('add_item/', AddCartItemView.as_view(), name='add-cart-item'),
]
