from django.contrib import admin
from django.urls import path, include

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
    )

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/store/', include('products.urls')),
    path('api/v1/orders/', include('order.urls')),
    path('api/v1/carts/', include('cart.urls')),
    path('api/v1/auth/', include('users.urls')),
    path('api/v1/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/v1/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/v1/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
]
