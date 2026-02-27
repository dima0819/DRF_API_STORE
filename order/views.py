from django.shortcuts import render
from .serializers import OrderSerializer
from .models import Order
from rest_framework import generics

class OrderViewList(generics.ListAPIView):
    serializer_class = OrderSerializer
    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)
    
class OrderViewDetail(generics.RetrieveAPIView):
    serializer_class = OrderSerializer
    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)