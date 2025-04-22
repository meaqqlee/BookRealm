import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { BooksService } from '../services/books.service';
import { AuthService } from '../services/auth.service';
import { Book } from '../interfaces/book.model';
import { FavoritesService } from '../services/favorites.service';

@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.css']
})
export class BookDetailsComponent implements OnInit {
  book: Book | null = null;
  isLoading: boolean = true;
  error: string | null = null;
  isFavorite: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private booksService: BooksService,
    private favoritesService: FavoritesService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const bookId = params.get('id');
      if (!bookId) {
        this.router.navigate(['/']);
        return;
      }

      this.loadBookDetails(bookId);
    });
  }

  loadBookDetails(bookId: string): void {
    this.isLoading = true;
    this.booksService.getBookDetails(Number(bookId)).subscribe({
      next: (book) => {
        this.book = book;
        this.isLoading = false;
        this.checkIfFavorite(bookId);
      },
      error: (error) => {
        this.error = 'Failed to load book details. Please try again.';
        this.isLoading = false;
        console.error('Error fetching book details:', error);
      }
    });
  }

  checkIfFavorite(bookId: string): void {
    if (!this.authService.isLoggedIn) return;

    this.favoritesService.isFavorite(Number(bookId)).subscribe({
      next: (isFav) => {
        this.isFavorite = isFav;
      },
      error: (error) => {
        console.error('Error checking favorite status:', error);
      }
    });
  }

  toggleFavorite(): void {
    if (!this.authService.isLoggedIn) {
      this.router.navigate(['/login']);
      return;
    }

    if (!this.book) return;

    // Convert book.id to number to match the expected parameter type
    const bookId = typeof this.book.id === 'string' ? Number(this.book.id) : this.book.id;

    if (this.isFavorite) {
      this.favoritesService.removeFromFavorites(bookId).subscribe({
        next: () => {
          this.isFavorite = false;
        },
        error: (error) => {
          console.error('Error removing from favorites:', error);
        }
      });
    } else {
      this.favoritesService.addToFavorites(bookId).subscribe({
        next: () => {
          this.isFavorite = true;
        },
        error: (error) => {
          console.error('Error adding to favorites:', error);
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
