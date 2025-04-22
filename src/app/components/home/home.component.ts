import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BooksService } from '../../services/books.service';
import { Book } from '../../interfaces/book.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  searchQuery: string = '';
  advancedAuthor: string = '';
  advancedYear: string = '';
  advancedPublisher: string = '';

  books: Book[] = [];
  featuredBooks: Book[] = [];
  isLoading: boolean = false;
  showAdvancedSearch: boolean = false;

  constructor(
    private booksService: BooksService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadFeaturedBooks();
  }

  loadFeaturedBooks(): void {
    this.isLoading = true;
    this.booksService.getFeaturedBooks().subscribe({
      next: (books) => {
        this.featuredBooks = books;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading featured books:', error);
        this.isLoading = false;
      }
    });
  }

  onSearch(): void {
    if (!this.searchQuery.trim() &&
      !this.advancedAuthor.trim() &&
      !this.advancedYear.trim() &&
      !this.advancedPublisher.trim()) {
      return;
    }

    this.isLoading = true;
    this.booksService.searchBooks(
      this.searchQuery,
      this.advancedAuthor,
      this.advancedYear,
      this.advancedPublisher
    ).subscribe({
      next: (books) => {
        this.books = books;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error searching books:', error);
        this.isLoading = false;
      }
    });
  }

  toggleAdvancedSearch(): void {
    this.showAdvancedSearch = !this.showAdvancedSearch;
  }

  viewBookDetails(bookId: string): void {
    this.router.navigate(['/book', bookId]);
  }

  addToFavorites(book: Book, event: Event): void {
    event.stopPropagation();
    this.booksService.addToFavorites(book.id).subscribe({
      next: () => {
        // Show a success indication
        book.isFavorite = true;
      },
      error: (error) => {
        console.error('Error adding book to favorites:', error);
      }
    });
  }
}
