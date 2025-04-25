import { Component, OnInit } from '@angular/core';
import { CommonModule }            from '@angular/common';
import { RouterModule, Router }    from '@angular/router';
import { FavoritesService, Favorite } from '../services/favorites.service';
import { Book }                    from '../interfaces/book.model';

// We extend Book with the dateAdded field
interface FavoriteBook extends Book {
  dateAdded: Date;
}

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent implements OnInit {
  favoriteBooks: FavoriteBook[] = [];
  isLoading = true;
  errorMessage = '';

  constructor(
    private favoritesService: FavoritesService,
    public router: Router      // ← made public so template can use router.navigate
  ) {}

  ngOnInit(): void {
    this.loadFavorites();
  }

  private loadFavorites(): void {
    this.isLoading = true;
    this.favoritesService.getFavorites().subscribe({
      next: (favorites: Favorite[]) => {
        this.favoriteBooks = favorites.map(fav => ({
          ...fav.book,
          dateAdded: new Date(fav.created_at)
        }));
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Error loading favorites:', err);
        this.errorMessage = 'Не удалось загрузить список избранного. Попробуйте позже.';
        this.isLoading = false;
      }
    });
  }

  viewBookDetails(bookId: number): void {
    this.router.navigate(['/book', bookId]);
  }

  removeFromFavorites(bookId: number, event: Event): void {
    event.stopPropagation();
    this.favoritesService.removeFromFavorites(bookId).subscribe({
      next: () => {
        this.favoriteBooks = this.favoriteBooks.filter(b => b.id !== bookId);
      },
      error: (err: any) => {
        console.error('Error removing from favorites:', err);
        this.errorMessage = 'Не удалось удалить книгу из избранного.';
      }
    });
  }
}
