from cart.permissions import IsOwner
from .serializers import CartSerializer, AddCartItemSerializer, CartItemSerializer
from .models import Cart, CartItem
from rest_framework import generics, status
from rest_framework.response import Response


class CartDetailView(generics.RetrieveAPIView):
    """Return (and lazily create) the current user's cart.

    The cart is user-specific, so the response must never be cached
    or shared between users.
    """
    serializer_class = CartSerializer
    permission_classes = [IsOwner,]

    def get_object(self):
        cart, _ = Cart.objects.prefetch_related('items__product').get_or_create(
            user=self.request.user
        )
        self.check_object_permissions(self.request, cart)
        return cart

    def post(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)


class AddCartItemView(generics.CreateAPIView):
    serializer_class = AddCartItemSerializer
    permission_classes = [IsOwner,]

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
    permission_classes = [IsOwner,]

    def get_queryset(self):
        return CartItem.objects.filter(cart__user=self.request.user)
