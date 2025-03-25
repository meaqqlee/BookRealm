import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Book } from '../interfaces/book.model';

@Injectable({
  providedIn: 'root'
})
export class BooksService {
  private DJANGO_API_URL = 'http://localhost:8000/api/books';

  constructor(private http: HttpClient) {}

  // // Example: GET /api/books/?search=title
  // searchBooks(query: string): Observable<Book[]> {
  //   return this.http.get<Book[]>(${this.DJANGO_API_URL}/?search=${query});
  // }
  //
  // // Example: GET /api/books/:id
  // getBookDetails(bookId: string): Observable<Book> {
  //   return this.http.get<Book>(${this.DJANGO_API_URL}/${bookId}/);
  // }
}
