from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

urlpatterns = [
    # Auth endpoints
    path('auth/login/', views.login_view, name='login'),
    path('auth/register/', views.register_view, name='register'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Books endpoints
    path('books/', views.search_books, name='books'),
    path('books/featured/', views.featured_books, name='featured_books'),
    path('books/<int:pk>/', views.BookDetailView.as_view(), name='book_detail'),

    # User profile
    path('users/profile/', views.UserProfileView.as_view(), name='user_profile'),

    # Favorites
    path('favorites/', views.FavoriteListView.as_view(), name='favorites'),
    path('favorites/<int:book_id>/', views.FavoriteDetailView.as_view(), name='favorite_detail'),
]
