from django.shortcuts import render
from .serializers import OrderSerializer, OrderItemSerializer, OrderCreateSerializer
from .models import Order
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page, cache_control

@method_decorator(cache_control(private=True, max_age=60 * 15), name='dispatch')
class OrderViewList(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated,]
    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)
    
class OrderViewDetail(generics.RetrieveAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated,]
    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)
   
class OrderCreateView(generics.CreateAPIView):
    serializer_class = OrderCreateSerializer
    permission_classes = [IsAuthenticated,]
    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)
