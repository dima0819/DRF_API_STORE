from rest_framework import serializers
from .models import Cart, CartItem
from products.serializers import ProductSerializer

class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    
    class Meta:
        model = CartItem
        fields = ['id', 'cart', 'product', 'quantity', 'get_total_price']
        
class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total_cart_price = serializers.SerializerMethodField()
    class Meta:
        model = Cart
        fields = ['id','items', 'total_cart_price']
    
    def get_total_cart_price(self, obj):
        total = sum([item.get_total_price() for item in obj.items.all()])
        return total
    
class AddCartItemSerializer(serializers.ModelSerializer):
    product_id = serializers.IntegerField() 

    class Meta:
        model = CartItem
        fields = ['product_id', 'quantity']

    def save(self, **kwargs):
        product_id = self.validated_data['product_id']
        quantity = self.validated_data['quantity']
        cart = self.context['cart'] # Мы передадим корзину из View
        cart_item, created = CartItem.objects.get_or_create(
            cart=cart, 
            product_id=product_id,
            defaults={'quantity': quantity}
        )
        
        if not created:
            cart_item.quantity += quantity
            cart_item.save()
        
        return cart_item
