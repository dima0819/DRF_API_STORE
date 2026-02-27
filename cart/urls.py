from django.urls import path, include
from .views import CartViewList, CartViewDetail, AddCartItemView

urlpatterns = [
    path('', CartViewList.as_view(), name='cart-list'),
    path('details/<int:pk>/', CartViewDetail.as_view(), name='cart-detail'),
    path('add_item/', AddCartItemView.as_view(), name='add-cart-item'),
]
