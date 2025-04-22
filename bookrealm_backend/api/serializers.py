from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Book, UserProfile, Favorite, Review


# Custom serializers using serializer.Serializer
class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    password = serializers.CharField(max_length=128, write_only=True)


class UserRegistrationSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    password = serializers.CharField(max_length=128, write_only=True)
    password_confirm = serializers.CharField(max_length=128, write_only=True)

    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError("Passwords don't match")
        return data

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        UserProfile.objects.create(user=user)
        return user


# ModelSerializers
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']


class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = UserProfile
        fields = ['id', 'user', 'bio', 'avatar']


class BookSerializer(serializers.ModelSerializer):
    is_favorite = serializers.SerializerMethodField()

    class Meta:
        model = Book
        fields = ['id', 'title', 'author', 'description', 'cover_image',
                  'publisher', 'year', 'isbn', 'featured', 'is_favorite']

    def get_is_favorite(self, obj):
        user = self.context.get('request').user
        if user and user.is_authenticated:
            return Favorite.objects.filter(user=user, book=obj).exists()
        return False


class FavoriteSerializer(serializers.ModelSerializer):
    book = BookSerializer(read_only=True)

    class Meta:
        model = Favorite
        fields = ['id', 'book', 'created_at']


class ReviewSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Review
        fields = ['id', 'user', 'book', 'text', 'rating', 'created_at']
        read_only_fields = ['user']
