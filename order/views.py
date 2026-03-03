from django.shortcuts import render
from .serializers import OrderSerializer, OrderItemSerializer, OrderCreateSerializer
from .models import Order
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

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
