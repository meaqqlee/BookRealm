import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {Book} from '../interfaces/book.model';

@Injectable({
  providedIn: 'root'
})
export class BooksService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) { }

  getFeaturedBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.apiUrl}/books/featured/`)
      .pipe(
        catchError(error => {
          console.error('Error fetching featured books:', error);
          return throwError(() => new Error('Failed to load featured books. Please try again later.'));
        })
      );
  }

  searchBooks(query: string, author?: string, year?: number, publisher?: string): Observable<Book[]> {
    let params = new HttpParams().set('query', query || '');

    if (author) params = params.set('author', author);
    if (year) params = params.set('year', year.toString());
    if (publisher) params = params.set('publisher', publisher);

    return this.http.get<Book[]>(`${this.apiUrl}/books/`, { params })
      .pipe(
        catchError(error => {
          console.error('Error searching books:', error);
          return throwError(() => new Error('Failed to search books. Please try again later.'));
        })
      );
  }

  getBookDetails(id: number): Observable<Book> {
    return this.http.get<Book>(`${this.apiUrl}/books/${id}/`)
      .pipe(
        catchError(error => {
          console.error(`Error getting book details for ID ${id}:`, error);
          return throwError(() => new Error('Failed to load book details. Please try again later.'));
        })
      );
  }

  getRecommendedBooks(): Observable<Book[]> {
    // You can implement proper recommendations later, for now just return featured
    return this.getFeaturedBooks().pipe(
      map(books => books.slice(0, 4))
    );
  }

  // You can add more methods here as needed for admin functionality
  createBook(bookData: Partial<Book>): Observable<Book> {
    return this.http.post<Book>(`${this.apiUrl}/books/`, bookData)
      .pipe(
        catchError(error => {
          console.error('Error creating book:', error);
          return throwError(() => new Error('Failed to create book. Please try again.'));
        })
      );
  }

  updateBook(id: number, bookData: Partial<Book>): Observable<Book> {
    return this.http.put<Book>(`${this.apiUrl}/books/${id}/`, bookData)
      .pipe(
        catchError(error => {
          console.error(`Error updating book ID ${id}:`, error);
          return throwError(() => new Error('Failed to update book. Please try again.'));
        })
      );
  }

  deleteBook(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/books/${id}/`)
      .pipe(
        catchError(error => {
          console.error(`Error deleting book ID ${id}:`, error);
          return throwError(() => new Error('Failed to delete book. Please try again.'));
        })
      );
  }
}
