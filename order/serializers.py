from django.db import transaction
from rest_framework import serializers
from .models import Order, OrderItem
from cart.models import Cart
from decimal import Decimal

class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source='product.name')
    total_price = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = ['id', 'product_name', 'quantity', 'price', 'total_price']

    def get_total_price(self, obj):
        return obj.total_price()

class OrderCreateSerializer(serializers.ModelSerializer):
    user_phone_number = serializers.ReadOnlyField(source='user.phone_number')
    class Meta:
        model = Order
        fields = ['id', 'created_at', 'is_paid', 'address', 'user_phone_number']
        
    def validate_address(self, value):
        if not value:
            raise serializers.ValidationError("Address is required")
        return value
    
    def validate_user__phone_number(self, value):
        if not value:
            raise serializers.ValidationError("Phone number is required")
        return value

    def create(self, validated_data):
        user = self.context['request'].user
        with transaction.atomic():
            cart = Cart.objects.get(user=user)
            cart_items = cart.items.select_related('product').all()
            if not cart_items:
                raise serializers.ValidationError("Cart is empty")
            order = Order.objects.create(user=user, **validated_data)
            for item in cart_items:
                if item.product.stock < item.quantity:
                    raise serializers.ValidationError(f"Product {item.product.name} stock is not enough")
                OrderItem.objects.create(
                    order=order,
                    product=item.product,
                    quantity=item.quantity,
                    price=item.product.price
                )
                item.product.stock -= item.quantity
                item.product.save()
            cart.items.all().delete()
            return order
    
class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    total_order_price = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = ['id', 'created_at', 'is_paid', 'address', 'items', 'total_order_price']

    def get_total_order_price(self, obj):
        return sum((item.total_price() for item in obj.items.all()), Decimal('0'))