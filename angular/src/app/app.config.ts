import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { API_BASE_URL, API_URL } from './config';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptors, } from '@angular/common/http';
import { authInterceptor, errorInterceptor } from './services/interceptors/error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([authInterceptor, errorInterceptor])),
    // { provide: API_BASE_URL, useValue: API_URL },
    // { provide: HTTP_INTERCEPTORS, useClass: RequestInterceptor, multi: true },
    provideRouter(routes), provideClientHydration()
  ]
};
