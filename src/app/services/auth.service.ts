import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { UserProfile } from '../interfaces/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'http://localhost:8000/api'; // Django backend URL
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'user_data';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/auth/login/`, { username, password })
      .pipe(
        tap(response => {
          if (response && response.token) {
            this.setToken(response.token);
            if (response.user) {
              localStorage.setItem(this.USER_KEY, JSON.stringify(response.user));
            }
          }
        }),
        catchError(error => {
          console.error('Login error', error);
          return throwError(() => error);
        })
      );
  }

  register(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/auth/register/`, { username, password })
      .pipe(
        tap(response => {
          if (response && response.token) {
            this.setToken(response.token);
            if (response.user) {
              localStorage.setItem(this.USER_KEY, JSON.stringify(response.user));
            }
          }
        }),
        catchError(error => {
          console.error('Registration error', error);
          return throwError(() => error);
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getUserProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.API_URL}/users/profile/`)
      .pipe(
        catchError(error => {
          console.error('Error fetching user profile', error);
          return throwError(() => error);
        })
      );
  }

  updateUserProfile(profile: Partial<UserProfile>): Observable<UserProfile> {
    return this.http.patch<UserProfile>(`${this.API_URL}/users/profile/`, profile)
      .pipe(
        catchError(error => {
          console.error('Error updating user profile', error);
          return throwError(() => error);
        })
      );
  }
}
