import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../interfaces/user.model';
import { Observable } from 'rxjs';

// TODO : DIANA FIX IT

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Example: 'http://127.0.0.1:8000/api'
  private DJANGO_API_URL = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  // login(username: string, password: string): Observable<any> {
  //   // Typically: POST /api/login/ returning { token: ... }
  //   return this.http.post<any>(${this.DJANGO_API_URL}/login/, { username, password });
  // }
  //
  // register(user: User): Observable<any> {
  //   // Typically: POST /api/register/
  //   return this.http.post<any>(${this.DJANGO_API_URL}/register/, user);
  // }

  logout(): void {
    localStorage.removeItem('token');
  }

  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
