from django.db import models
from django.contrib.auth.models import User
from .managers import BookManager


class Book(models.Model):
    title = models.CharField(max_length=255)
    author = models.CharField(max_length=255)
    description = models.TextField()
    cover_image = models.URLField()
    publisher = models.CharField(max_length=255)
    year = models.IntegerField()
    isbn = models.CharField(max_length=20, unique=True)
    featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = BookManager()

    def __str__(self):
        return self.title


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    bio = models.TextField(blank=True, null=True)
    avatar = models.URLField(blank=True, null=True)

    def __str__(self):
        return f"{self.user.username}'s profile"


class Favorite(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='favorites')
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='favorited_by')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'book')

    def __str__(self):
        return f"{self.user.username} favorited {self.book.title}"


class Review(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews')
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='reviews')
    text = models.TextField()
    rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)])
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('user', 'book')

    def __str__(self):
        return f"{self.user.username}'s review of {self.book.title}"
