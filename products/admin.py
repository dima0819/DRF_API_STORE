from django.contrib import admin
from .models import Product, Category

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'price', 'stock', 'created_at', 'updated_at', 'category')
    search_fields = ('name', 'category__name')
    list_filter = ('stock', 'created_at', 'updated_at', 'category')
    prepopulated_fields = {'slug': ('name',)}
    
    
@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')
    search_fields = ('name',)