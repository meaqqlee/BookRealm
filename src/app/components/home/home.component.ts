import { Component, OnInit } from '@angular/core';
import { CommonModule }       from '@angular/common';
import { FormsModule }        from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { forkJoin }           from 'rxjs';

import { BooksService }       from '../../services/books.service';
import { FavoritesService, Favorite } from '../../services/favorites.service';
import { Book }               from '../../interfaces/book.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  searchQuery      = '';
  advancedAuthor   = '';
  advancedYear     = '';
  advancedPublisher= '';
  books: Book[]         = [];
  featuredBooks: Book[] = [];
  isLoading = false;
  showAdvancedSearch = false;

  constructor(
    private booksService: BooksService,
    private favoritesService: FavoritesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadFeaturedWithFavorites();
  }

  private loadFeaturedWithFavorites(): void {
    this.isLoading = true;
    forkJoin({
      featured: this.booksService.getFeaturedBooks(),
      favs:     this.favoritesService.getFavorites()
    }).subscribe({
      next: ({ featured, favs }) => {
        const favIds = new Set<number>(favs.map((f: Favorite) => f.book.id));
        this.featuredBooks = featured.map(b => ({
          ...b,
          isFavorite: favIds.has(b.id)
        }));
        this.isLoading = false;
      },
      error: err => {
        console.error('Error loading featured books:', err);
        this.isLoading = false;
      }
    });
  }

  onSearch(): void {
    if (
      !this.searchQuery.trim() &&
      !this.advancedAuthor.trim() &&
      !this.advancedYear.trim() &&
      !this.advancedPublisher.trim()
    ) return;

    this.isLoading = true;
    forkJoin({
      books: this.booksService.searchBooks(
        this.searchQuery,
        this.advancedAuthor,
        this.advancedYear ? Number(this.advancedYear) : undefined,
        this.advancedPublisher
      ),
      favs: this.favoritesService.getFavorites()
    }).subscribe({
      next: ({ books, favs }) => {
        const favIds = new Set<number>(favs.map((f: Favorite) => f.book.id));
        this.books = books.map(b => ({
          ...b,
          isFavorite: favIds.has(b.id)
        }));
        this.isLoading = false;
      },
      error: err => {
        console.error('Error searching books:', err);
        this.isLoading = false;
      }
    });
  }

  toggleAdvancedSearch(): void {
    this.showAdvancedSearch = !this.showAdvancedSearch;
  }

  viewBookDetails(bookId: number | string): void {
    this.router.navigate(['/book', bookId]);
  }

  addToFavorites(book: Book, event: Event): void {
    event.stopPropagation();
    const id = typeof book.id === 'string' ? Number(book.id) : book.id;
    this.favoritesService.addToFavorites(id).subscribe({
      next: () => (book.isFavorite = true),
      error: (err: any) => console.error('Error adding favorite:', err)
    });
  }
}
