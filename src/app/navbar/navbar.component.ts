import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {AuthService} from '../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="nav-container">
      <div class="logo">
        <a routerLink="/">BookRealm</a>
      </div>
      <nav>
        <ul>
          <li><a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Home</a></li>
          <li *ngIf="authService.isLoggedIn"><a routerLink="/favorites" routerLinkActive="active">My Favorites</a></li>
          <li *ngIf="authService.isLoggedIn"><a routerLink="/profile" routerLinkActive="active">Profile</a></li>
        </ul>
      </nav>
      <div class="auth-buttons">
        <ng-container *ngIf="authService.isLoggedIn; else loggedOut">
          <button class="btn btn-logout" (click)="onLogout()">Logout</button>
        </ng-container>
        <ng-template #loggedOut>
          <a routerLink="/login" class="btn btn-login">Login</a>
        </ng-template>
      </div>
    </div>
  `,
  styles: [`
    .nav-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px 20px;
      background-color: #fff;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .logo a {
      font-size: 24px;
      font-weight: bold;
      color: #D14A16;
      text-decoration: none;
    }

    nav ul {
      display: flex;
      list-style: none;
      gap: 20px;
      margin: 0;
      padding: 0;
    }

    nav ul li a {
      text-decoration: none;
      color: #998E8B;
      font-size: 16px;
      transition: color 0.3s;
    }

    nav ul li a:hover, nav ul li a.active {
      color: #D14A16;
    }

    .btn {
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
      text-decoration: none;
      font-size: 14px;
      transition: all 0.3s ease;
    }

    .btn-login {
      background-color: #D14A16;
      color: white;
      border: none;
    }

    .btn-logout {
      background-color: transparent;
      color: #D14A16;
      border: 1px solid #D14A16;
    }

    .btn:hover {
      opacity: 0.9;
    }
  `]
})
export class NavbarComponent {
  constructor(public authService: AuthService) {}

  onLogout(): void {
    this.authService.logout();
  }
}
