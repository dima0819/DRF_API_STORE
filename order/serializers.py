from rest_framework import serializers
from .models import Order, OrderItem
from cart.models import Cart
from products.serializers import ProductSerializer
from decimal import Decimal


class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    total_price = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'quantity', 'price', 'total_price']

    def get_total_price(self, obj):
        return obj.total_price()

class OrderCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ['id', 'created_at', 'is_paid', 'address']

    def create(self, validated_data):
        user = self.context['request'].user
        cart = Cart.objects.get(user=user)
        cart_items = cart.items.all()
        if not cart_items:
            raise serializers.ValidationError("Cart is empty")
        order = Order.objects.create(user=user, **validated_data)
        order_items = []
        for item in cart_items:
            order_items.append(
                OrderItem(
                    order=order,
                    product=item.product,
                    quantity=item.quantity,
                    price=item.product.price
                )
            )
        # Note: product.stock is a BooleanField in this project, skip numeric decrement.
        OrderItem.objects.bulk_create(order_items)
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