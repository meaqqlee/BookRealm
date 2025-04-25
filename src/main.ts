import { bootstrapApplication } from '@angular/platform-browser';
<<<<<<< HEAD
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './app/components/home/home.component';

bootstrapApplication(HomeComponent, {
  providers: [importProvidersFrom(HttpClientModule)]
});
=======
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
>>>>>>> b9a19e3 (done backend)
