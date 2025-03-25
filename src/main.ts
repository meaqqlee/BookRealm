import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import {AppComponent} from './app/app.component';
import {routes} from './app/app.routes';
import {TokenInterceptor} from './app/services/token.interceptor';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    //provideHttpClient(withInterceptors([TokenInterceptor]))
  ]
});
