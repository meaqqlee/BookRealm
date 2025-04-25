// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  BehaviorSubject,
  Observable,
  throwError,
  timer,
  Subscription
} from 'rxjs';
import { tap, catchError, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { UserProfile } from '../interfaces/user.model';
import { environment } from '../../app/environments/environments';

interface JwtPayload {
  exp: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private currentUserSubject = new BehaviorSubject<UserProfile | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private refreshSub?: Subscription;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.initAuth();
  }

  private initAuth(): void {
    const userData = localStorage.getItem('userData');
    const token = localStorage.getItem('accessToken');
    if (userData && token) {
      this.currentUserSubject.next(JSON.parse(userData));
      this.scheduleRefresh(token);
    }
  }

  get isLoggedIn(): boolean {
    return !!this.currentUserSubject.value && !!this.token;
  }

  get currentUser(): UserProfile | null {
    return this.currentUserSubject.value;
  }

  get token(): string | null {
    return localStorage.getItem('accessToken');
  }

  login(username: string, password: string): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/auth/login/`, { username, password })
      .pipe(
        tap(res => {
          this.handleAuthTokens(
            res.user,
            res.access,
            res.refresh
          );
        }),
        catchError(err => {
          const msg = err.error?.detail || 'Ошибка при входе';
          return throwError(() => new Error(msg));
        })
      );
  }

  register(
    username: string,
    email: string,
    password: string
  ): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/auth/register/`, {
        username,
        email,
        password,
        password_confirm: password
      })
      .pipe(
        tap(res => {
          this.handleAuthTokens(
            res.user,
            res.access,
            res.refresh
          );
        }),
        catchError(err => {
          const msg = Object.values(err.error || {})
            .flat()
            .join(', ') || 'Ошибка при регистрации';
          return throwError(() => new Error(msg));
        })
      );
  }

  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userData');
    this.currentUserSubject.next(null);
    this.refreshSub?.unsubscribe();
    this.router.navigate(['/login']);
  }

  refreshToken(): Observable<any> {
    const refresh = localStorage.getItem('refreshToken');
    if (!refresh) {
      this.logout();
      return throwError(() => new Error('Нет refresh-токена'));
    }
    return this.http
      .post<any>(`${this.apiUrl}/auth/refresh/`, { refresh })
      .pipe(
        tap(res => {
          localStorage.setItem('accessToken', res.access);
          this.scheduleRefresh(res.access);
        }),
        catchError(err => {
          this.logout();
          return throwError(() => new Error('Сессия истекла'));
        })
      );
  }

  getUserProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(
      `${this.apiUrl}/users/profile/`
    );
  }

  updateUserProfile(profileData: any): Observable<UserProfile> {
    return this.http.put<UserProfile>(
      `${this.apiUrl}/users/profile/`,
      profileData
    );
  }

  private handleAuthTokens(
    user: any,
    accessToken: string,
    refreshToken: string
  ) {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('userData', JSON.stringify(user));
    this.currentUserSubject.next(user);
    this.scheduleRefresh(accessToken);
    this.router.navigate(['/']);
  }

  private scheduleRefresh(token: string) {
    const exp = this.getTokenExpiration(token)
    const msUntilRefresh = exp * 1000 - Date.now() - 60_000
    timer(Math.max(msUntilRefresh, 0))
      .pipe(switchMap(() => this.refreshToken()))
      .subscribe()
  }
  private getTokenExpiration(token: string): number {
    try {
      // split the JWT, base64-decode the middle part, parse JSON
      const payload = token.split('.')[1]
      const json   = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
      const data   = JSON.parse(json)
      return typeof data.exp === 'number' ? data.exp : 0
    } catch {
      return 0
    }
  }
}
