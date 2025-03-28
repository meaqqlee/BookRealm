export interface Book {
  id: string;
  title: string;
  author: string;
  publisher?: string;
  publicationDate?: string;
  description?: string;
  coverImage?: string;
  // additional fields as needed
}
