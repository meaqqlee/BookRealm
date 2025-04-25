export interface Book {
  id: number;
  title: string;
  author: string;
  description?: string;
  coverImage?: string;
  ebookUrl?: string; 
  purchaseUrl?: string; 
  publisher?: string;
  publishYear?: number;
  isbn?: string;
  genre?: string[];
  pageCount?: number;
  isFavorite?: boolean;
  dateAdded?: Date;
}
