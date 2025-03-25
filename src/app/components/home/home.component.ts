import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { BooksService } from '../../services/books.service';
import { AuthService } from '../../services/auth.service';
import { Book } from '../../interfaces/book.model';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
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
      next: (res) => {
        this.isSearching = false;
        // 'res' is presumed to be an array of Book from Django
        this.books = res;
      },
      error: (err) => {
        this.isSearching = false;
        console.error(err);
      }
    });
  }

  onLogout(): void {
    this.authService.logout();
  }

  onAddFavorite(book: Book): void {
    //console.log(Add to favorites (stub): ${book.title});
    // Future: call a Django endpoint like POST /api/favorites
  }

  onViewDetails(book: Book): void {
    //console.log(View details for: ${book.id});
    // Future: router.navigate(['/book', book.id]), or show a modal
  }
}
