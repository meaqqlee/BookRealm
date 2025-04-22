// token.interceptor.ts
import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { BehaviorSubject, Observable, throwError } from 'rxjs';

// Maintain state outside the interceptor function
let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<any>(null);

export const TokenInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const authService = inject(AuthService);

  // Skip adding token for auth endpoints
  if (request.url.includes('/auth/login') || request.url.includes('/auth/register')) {
    return next(request);
  }

  // Add token to other requests
  const token = authService.token;
  if (token) {
    request = addToken(request, token);
  }

  return next(request).pipe(
    catchError(error => {
      if (error.status === 401) {
        return handle401Error(request, next, authService);
      }
      return throwError(() => error);
    })
  );
};

function addToken(request: HttpRequest<any>, token: string): HttpRequest<any> {
  return request.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });
}

function handle401Error(
  request: HttpRequest<any>,
  next: HttpHandlerFn,
  authService: AuthService
): Observable<any> {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null);

    return authService.refreshToken().pipe(
      switchMap(token => {
        isRefreshing = false;
        refreshTokenSubject.next(token.access);
        return next(addToken(request, token.access));
      }),
      catchError(error => {
        isRefreshing = false;
        authService.logout();
        return throwError(() => error);
      })
    );
  } else {
    return refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap(token => next(addToken(request, token)))
    );
  }
}
