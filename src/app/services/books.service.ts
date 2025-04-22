import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Book } from '../interfaces/book.model';

@Injectable({
  providedIn: 'root'
})
export class BooksService {
  private readonly API_URL = 'http://localhost:8000/api'; // Django backend URL

  constructor(private http: HttpClient) {}

  // Get featured books for home page
  getFeaturedBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.API_URL}/books/featured/`)
      .pipe(
        catchError(error => {
          console.error('Error fetching featured books', error);
          return throwError(() => error);
        })
      );
  }

  // Search for books with various filters
  searchBooks(
    query: string = '',
    author: string = '',
    year: string = '',
    publisher: string = ''
  ): Observable<Book[]> {
    let params = new HttpParams();

    if (query) params = params.append('q', query);
    if (author) params = params.append('author', author);
    if (year) params = params.append('year', year);
    if (publisher) params = params.append('publisher', publisher);

    return this.http.get<Book[]>(`${this.API_URL}/books/search/`, { params })
      .pipe(
        catchError(error => {
          console.error('Error searching books', error);
          return throwError(() => error);
        })
      );
  }

  // Get details of a specific book
  getBookDetails(bookId: string): Observable<Book> {
    return this.http.get<Book>(`${this.API_URL}/books/${bookId}/`)
      .pipe(
        catchError(error => {
          console.error(`Error fetching book with ID ${bookId}`, error);
          return throwError(() => error);
        })
      );
  }

  // Get user's favorite books
  getFavoriteBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.API_URL}/books/favorites/`)
      .pipe(
        catchError(error => {
          console.error('Error fetching favorite books', error);
          return throwError(() => error);
        })
      );
  }

  // Add a book to favorites
  addToFavorites(bookId: string): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/books/favorites/`, { book_id: bookId })
      .pipe(
        catchError(error => {
          console.error(`Error adding book ID ${bookId} to favorites`, error);
          return throwError(() => error);
        })
      );
  }

  // Remove a book from favorites
  removeFromFavorites(bookId: string): Observable<any> {
    return this.http.delete<any>(`${this.API_URL}/books/favorites/${bookId}/`)
      .pipe(
        catchError(error => {
          console.error(`Error removing book ID ${bookId} from favorites`, error);
          return throwError(() => error);
        })
      );
  }

  // Check if a book is in the user's favorites
  checkFavoriteStatus(bookId: string): Observable<{isFavorite: boolean}> {
    return this.http.get<{isFavorite: boolean}>(`${this.API_URL}/books/favorites/${bookId}/check/`)
      .pipe(
        catchError(error => {
          console.error(`Error checking favorite status for book ID ${bookId}`, error);
          return throwError(() => error);
        })
      );
  }
}
