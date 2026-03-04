from rest_framework import permissions 

class IsOwner(permissions.BasePermission):
    message = 'You have no access to this cart.'
    
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated)
    
    def has_object_permission(self, request, view, obj):
        if hasattr(obj, 'cart'):
            return obj.cart.user == request.user
        if hasattr(obj, 'user'):
            return obj.user == request.user
        return False
    