import { Injectable } from '@angular/core';
import { HttpClient }  from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Book }        from '../interfaces/book.model';

export interface Favorite {
  id: number;
  book: Book;
  created_at: string;
}

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  /** Получить весь список избранного */
  getFavorites(): Observable<Favorite[]> {
    return this.http
      .get<Favorite[]>(`${this.apiUrl}/favorites/`)
      .pipe(
        catchError(err => {
          console.error('Error fetching favorites:', err);
          return throwError(() => new Error('Не удалось загрузить избранное.'));
        })
      );
  }

  /** Добавить книгу в избранное */
  addToFavorites(bookId: number): Observable<Favorite> {
    return this.http
      .post<Favorite>(`${this.apiUrl}/favorites/${bookId}/`, {})
      .pipe(
        catchError(err => {
          console.error(`Error adding favorite ${bookId}:`, err);
          return throwError(() => new Error('Не удалось добавить в избранное.'));
        })
      );
  }

  /** Удалить книгу из избранного */
  removeFromFavorites(bookId: number): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/favorites/${bookId}/`)
      .pipe(
        catchError(err => {
          console.error(`Error removing favorite ${bookId}:`, err);
          return throwError(() => new Error('Не удалось удалить из избранного.'));
        })
      );
  }

  /** Проверить, есть ли книга в избранном */
  isFavorite(bookId: number): Observable<boolean> {
    return this.getFavorites()
      .pipe(
        map(favs => favs.some(f => Number(f.book.id) === bookId)),
        catchError(err => {
          console.error(`Error checking favorite status for ${bookId}:`, err);
          return throwError(() => err);
        })
      );
  }
}
