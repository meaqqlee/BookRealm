from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Book, UserProfile, Favorite, Review
from .serializers import (
    UserLoginSerializer, UserRegistrationSerializer,
    UserProfileSerializer, BookSerializer,
    FavoriteSerializer, ReviewSerializer
)


# Function-Based Views
@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    serializer = UserLoginSerializer(data=request.data)
    if serializer.is_valid():
        username = serializer.validated_data['username']
        password = serializer.validated_data['password']

        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response({'detail': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        if not user.check_password(password):
            return Response({'detail': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

        refresh = RefreshToken.for_user(user)

        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email
            }
        })
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        refresh = RefreshToken.for_user(user)

        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email
            }
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([AllowAny])
def search_books(request):
    query = request.query_params.get('query', '')
    author = request.query_params.get('author', '')
    year = request.query_params.get('year', None)
    publisher = request.query_params.get('publisher', '')

    if year and year.isdigit():
        year = int(year)
    else:
        year = None

    books = Book.objects.search(query, author, year, publisher)
    serializer = BookSerializer(books, many=True, context={'request': request})
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([AllowAny])
def featured_books(request):
    books = Book.objects.get_featured()
    serializer = BookSerializer(books, many=True, context={'request': request})
    return Response(serializer.data)


# Class-Based Views
class BookDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, pk):
        book = get_object_or_404(Book, pk=pk)
        serializer = BookSerializer(book, context={'request': request})
        return Response(serializer.data)


class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile = get_object_or_404(UserProfile, user=request.user)
        serializer = UserProfileSerializer(profile)
        return Response(serializer.data)

    def put(self, request):
        profile = get_object_or_404(UserProfile, user=request.user)
        serializer = UserProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class FavoriteListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        favorites = Favorite.objects.filter(user=request.user)
        serializer = FavoriteSerializer(favorites, many=True)
        return Response(serializer.data)


class FavoriteDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, book_id):
        book = get_object_or_404(Book, pk=book_id)
        favorite, created = Favorite.objects.get_or_create(user=request.user, book=book)
        if created:
            return Response({'detail': 'Book added to favorites'}, status=status.HTTP_201_CREATED)
        return Response({'detail': 'Book already in favorites'}, status=status.HTTP_200_OK)

    def delete(self, request, book_id):
        book = get_object_or_404(Book, pk=book_id)
        favorite = get_object_or_404(Favorite, user=request.user, book=book)
        favorite.delete()
        return Response({'detail': 'Book removed from favorites'}, status=status.HTTP_204_NO_CONTENT)
