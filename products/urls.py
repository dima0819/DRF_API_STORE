from django.urls import path, include
from .views import ProductViewList, ProductViewDetail, CategoryViewList, CategoryViewDetail

urlpatterns = [
    path('', ProductViewList.as_view()),
    path('<int:pk>/', ProductViewDetail.as_view()),
    path('categories/', CategoryViewList.as_view()),
    path('categories/<int:pk>/', CategoryViewDetail.as_view()),
]