// src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { BookDetailsComponent } from './book-details/book-details.component';
import { ProfileComponent } from './profile/profile.component';
import { FavoritesComponent } from './favorites/favorites.component';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [authGuard] },

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

  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
