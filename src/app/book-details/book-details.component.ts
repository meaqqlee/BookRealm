import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { BooksService } from '../services/books.service';
import { AuthService } from '../services/auth.service';
import { FavoritesService } from '../services/favorites.service';
import { Book } from '../interfaces/book.model';

@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.css']
})
export class BookDetailsComponent implements OnInit {
  book: Book | null    = null;
  isLoading = true;
  error: string | null = null;
  isFavorite = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private booksService: BooksService,
    private favoritesService: FavoritesService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (!idParam) {
        this.router.navigate(['/']);
        return;
      }
      const bookId = Number(idParam);
      this.loadBookDetails(bookId);
    });
  }

  private loadBookDetails(bookId: number): void {
    this.isLoading = true;
    this.booksService.getBookDetails(bookId).subscribe({
      next: (book: Book) => {
        this.book = book;
        this.isLoading = false;
        this.checkIfFavorite(bookId);
      },
      error: (err: any) => {
        console.error('Error fetching book details:', err);
        this.error = 'Failed to load book details. Please try again.';
        this.isLoading = false;
      }
    });
  }

  private checkIfFavorite(bookId: number): void {
    if (!this.authService.isLoggedIn) {
      this.isFavorite = false;
      return;
    }
    this.favoritesService.isFavorite(bookId).subscribe({
      next: (fav: boolean) => this.isFavorite = fav,
      error: (err: any) => console.error('Error checking favorite status:', err)
    });
  }

  toggleFavorite(): void {
    if (!this.authService.isLoggedIn) {
      this.router.navigate(['/login']);
      return;
    }
    if (!this.book) return;

    const bookId = this.book.id as number;
    if (this.isFavorite) {
      this.favoritesService.removeFromFavorites(bookId).subscribe(
        () => (this.isFavorite = false),
        (err: any) => console.error('Error removing favorite:', err)
      );
    } else {
      this.favoritesService.addToFavorites(bookId).subscribe(
        () => (this.isFavorite = true),
        (err: any) => console.error('Error adding favorite:', err)
      );
    }
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
