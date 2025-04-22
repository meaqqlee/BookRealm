import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {BooksService} from '../services/books.service';
import {Book} from '../interfaces/book.model';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent implements OnInit {
  favoriteBooks: Book[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(
    private booksService: BooksService,
    protected router: Router
  ) {}

  ngOnInit(): void {
    this.loadFavorites();
  }

  loadFavorites(): void {
    this.isLoading = true;
    this.booksService.getFavoriteBooks().subscribe({
      next: (books) => {
        this.favoriteBooks = books;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load your favorite books.';
        this.isLoading = false;
        console.error('Error loading favorites:', error);
      }
    });
  }

  viewBookDetails(bookId: string): void {
    this.router.navigate(['/book', bookId]);
  }

  removeFromFavorites(book: Book, event: Event): void {
    event.stopPropagation();

    this.booksService.removeFromFavorites(book.id).subscribe({
      next: () => {
        this.favoriteBooks = this.favoriteBooks.filter(b => b.id !== book.id);
      },
      error: (error) => {
        console.error('Error removing book from favorites:', error);
      }
    });
  }
}
