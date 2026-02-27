from .serializers import CartSerializer, AddCartItemSerializer, CartItemSerializer
from .models import Cart, CartItem
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response


class CartListCreateView(generics.ListCreateAPIView):
    """List (single) and ensure cart exists for current user."""
    serializer_class = CartSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Cart.objects.filter(user=self.request.user)

    def create(self, request, *args, **kwargs):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        serializer = self.get_serializer(cart)
        return Response(serializer.data, status=status.HTTP_200_OK)

class AddCartItemView(generics.CreateAPIView):
    serializer_class = AddCartItemSerializer
    permission_classes = [IsAuthenticated]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        cart, _ = Cart.objects.get_or_create(user=self.request.user)
        context['cart'] = cart
        return context

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        cart_item = serializer.save()
        output_serializer = CartItemSerializer(cart_item)
        return Response(output_serializer.data, status=status.HTTP_201_CREATED)


class CartItemDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CartItemSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return CartItem.objects.filter(cart__user=self.request.user)

