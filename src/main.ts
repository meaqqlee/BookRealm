import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './app/components/home/home.component';

bootstrapApplication(HomeComponent, {
  providers: [importProvidersFrom(HttpClientModule)]
});
