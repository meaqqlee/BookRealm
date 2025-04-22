export interface Book {
  id: string;
  title: string;
  author: string;
  description?: string;
  coverImage?: string;
  publisher?: string;
  publishYear?: number;
  isbn?: string;
  genre?: string[];
  pageCount?: number;
  isFavorite?: boolean;
  dateAdded?: Date;
}
