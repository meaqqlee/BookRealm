import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import {BookDetailsComponent} from './book-details/book-details.component';
import {ProfileComponent} from './profile/profile.component';
import {authGuard} from './auth.guard';
import {FavoritesComponent} from './favorites/favorites.component';
export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'book/:id', component: BookDetailsComponent },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [authGuard]
  },
  {
    path: 'favorites',
    component: FavoritesComponent,
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: '' } // Redirect all unknown paths to home
];
