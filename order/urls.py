from django.urls import path, include
from .views import OrderViewList, OrderViewDetail

urlpatterns = [
    path('order_list/', OrderViewList.as_view()),
    path('order_detail/<int:pk>/', OrderViewDetail.as_view()),
]