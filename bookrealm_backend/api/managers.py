from django.db import models
from django.db.models import Q


class BookManager(models.Manager):
    def get_featured(self):
        return self.filter(featured=True)

    def search(self, query=None, author=None, year=None, publisher=None):
        queryset = self.all()

        if query:
            queryset = queryset.filter(
                Q(title__icontains=query) |
                Q(description__icontains=query) |
                Q(author__icontains=query)
            )

        if author:
            queryset = queryset.filter(author__icontains=author)

        if year:
            queryset = queryset.filter(year=year)

        if publisher:
            queryset = queryset.filter(publisher__icontains=publisher)

        return queryset
