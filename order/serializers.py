from rest_framework import serializers
from .models import Order, OrderItem
from cart.models import Cart

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
        item.product.stock -= item.quantity
        item.product.save()
        OrderItem.objects.bulk_create(order_items)
        cart.items.all().delete()
        return order
    
class OrderSerializer(serializers.ModelSerializer):
    items = serializers.StringRelatedField(many=True)
    class Meta:
        model = Order
        fields = ['id', 'created_at', 'is_paid', 'address', 'items']