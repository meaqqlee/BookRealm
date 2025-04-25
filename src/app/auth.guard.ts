import { inject } from '@angular/core';
import {
  CanActivateFn,
  Router,
  UrlTree
} from '@angular/router';
import { AuthService } from './services/auth.service';

export const authGuard: CanActivateFn = (): boolean | UrlTree => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // проверяем свойство, а не метод
  if (authService.isLoggedIn) {
    return true;
  }

  return router.parseUrl('/login');
};
