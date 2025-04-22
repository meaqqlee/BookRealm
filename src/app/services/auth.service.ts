import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { UserProfile } from '../interfaces/user.model';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api';
  private currentUserSubject = new BehaviorSubject<UserProfile | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private tokenExpirationTimer: any;

  constructor(private http: HttpClient, private router: Router) {
    this.loadStoredUser();
  }

  private loadStoredUser() {
    const userData = localStorage.getItem('userData');
    const token = localStorage.getItem('token');
    if (userData && token) {
      const user: UserProfile = JSON.parse(userData);
      this.currentUserSubject.next(user);
    }
  }

  get isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  get currentUser(): UserProfile | null {
    return this.currentUserSubject.value;
  }

  get token(): string | null {
    return localStorage.getItem('token');
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/login/`, { username, password })
      .pipe(
        tap(response => {
          this.handleAuthentication(
            response.user.id,
            response.user.username,
            response.user.email,
            response.access,
            response.refresh
          );
        }),
        catchError(error => {
          let errorMessage = 'An error occurred during login';
          if (error.error && error.error.detail) {
            errorMessage = error.error.detail;
          }
          return throwError(() => new Error(errorMessage));
        })
      );
  }

  register(username: string, email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/register/`, {
      username,
      email,
      password,
      password_confirm: password
    }).pipe(
      tap(response => {
        this.handleAuthentication(
          response.user.id,
          response.user.username,
          response.user.email,
          response.access,
          response.refresh
        );
      }),
      catchError(error => {
        let errorMessage = 'An error occurred during registration';
        if (error.error) {
          errorMessage = Object.values(error.error).flat().join(', ');
        }
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  refreshToken(): Observable<any> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http.post<any>(`${this.apiUrl}/auth/refresh/`, {
      refresh: refreshToken
    }).pipe(
      tap(response => {
        localStorage.setItem('token', response.access);
        // Update token expiration
        this.autoLogout(3600 * 1000); // 1 hour
      }),
      catchError(error => {
        this.logout();
        return throwError(() => new Error('Session expired. Please login again.'));
      })
    );
  }

  logout(): void {
    localStorage.removeItem('userData');
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    this.currentUserSubject.next(null);
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
      this.tokenExpirationTimer = null;
    }
    this.router.navigate(['/login']);
  }

  private handleAuthentication(
    id: number,
    username: string,
    email: string,
    token: string,
    refreshToken: string,
    joinDate?: string
  ): void {
    const user: UserProfile = {
      id,
      username,
      email,
      joinDate: joinDate ? new Date(joinDate) : new Date() // Convert string to Date object
    };

    this.currentUserSubject.next(user);
    localStorage.setItem('userData', JSON.stringify(user));
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);

    // Set auto logout timer
    this.autoLogout(3600 * 1000); // 1 hour
  }

  private autoLogout(expirationDuration: number): void {
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }

    this.tokenExpirationTimer = setTimeout(() => {
      this.refreshToken().subscribe({
        error: () => this.logout()
      });
    }, expirationDuration);
  }

  getUserProfile(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/users/profile/`);
  }

  updateUserProfile(profileData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/users/profile/`, profileData);
  }
}
