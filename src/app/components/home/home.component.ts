import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'; 

import { BooksService } from '../../services/books.service';
import { AuthService } from '../../services/auth.service';
import { Book } from '../../interfaces/book.model';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.components.scss']
})
export class HomeComponent implements OnInit {
  searchQuery: string = '';
  books: Book[] = [];
  isSearching: boolean = false;

  // Additional fields for demonstrating multiple [(ngModel)]
  anotherField1: string = '';
  anotherField2: string = '';
  anotherField3: string = '';

  constructor(
    private booksService: BooksService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {}

  onSearch(): void {
    if (!this.searchQuery.trim()) return;
    this.isSearching = true;
    this.booksService.searchBooks(this.searchQuery).subscribe({
      next: (res: Book[]) => {
        this.isSearching = false;
        this.books = res;
      },
      error: (err: any) => {
        this.isSearching = false;
        console.error(err);
      }
    });
  }

  onLogout(): void {
    this.authService.logout();
  }

  onAddFavorite(book: Book): void {
    // Future: call a Django endpoint like POST /api/favorites
  }

  onViewDetails(book: Book): void {
    // Future: router.navigate(['/book', book.id]), or show a modal
  }
}
