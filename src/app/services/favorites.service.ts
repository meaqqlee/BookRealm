import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {Book} from '../interfaces/book.model';

interface Favorite {
  id: number;
  book: Book;
  created_at: string;
}

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) { }

  getFavorites(): Observable<Favorite[]> {
    return this.http.get<Favorite[]>(`${this.apiUrl}/favorites/`)
      .pipe(
        catchError(error => {
          console.error('Error fetching favorites:', error);
          return throwError(() => new Error('Failed to load favorites. Please try again later.'));
        })
      );
  }

  addToFavorites(bookId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/favorites/${bookId}/`, {})
      .pipe(
        catchError(error => {
          console.error(`Error adding book ID ${bookId} to favorites:`, error);
          return throwError(() => new Error('Failed to add book to favorites. Please try again.'));
        })
      );
  }

  removeFromFavorites(bookId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/favorites/${bookId}/`)
      .pipe(
        catchError(error => {
          console.error(`Error removing book ID ${bookId} from favorites:`, error);
          return throwError(() => new Error('Failed to remove book from favorites. Please try again.'));
        })
      );
  }

  isFavorite(bookId: number): Observable<boolean> {
    return new Observable<boolean>(observer => {
      this.getFavorites().subscribe({
        next: (favorites) => {
          const isFav = favorites.some(fav => Number(fav.book.id) === bookId);
          observer.next(isFav);
          observer.complete();
        },
        error: (error) => {
          observer.error(error);
        }
      });
    });
  }

}
