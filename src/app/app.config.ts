import { ApplicationConfig, importProvidersFrom, inject, provideEnvironmentInitializer, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptorsFromDi, withXsrfConfiguration } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AppAuthService } from './core/services/app.auth.service';
import { AuthConfig, OAuthModule, OAuthStorage } from 'angular-oauth2-oidc';
import { BrowserModule } from '@angular/platform-browser';
import { authConfig } from './app.auth';
import { JwtModule } from '@auth0/angular-jwt';
import { MarkdownModule } from 'ngx-markdown';

export function storageFactory(): OAuthStorage {
  return sessionStorage;
}

export function tokenGetter() {
  return localStorage.getItem('access_token');
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    provideAnimations(),
    importProvidersFrom(
        BrowserModule,
        OAuthModule.forRoot(),
        JwtModule.forRoot({
          config: {
            tokenGetter: tokenGetter,
            allowedDomains: ['localhost:8080'], // Update with your Keycloak domain
            disallowedRoutes: []
          }
        }),
        MarkdownModule.forRoot()
    ),
    { 
        provide: AuthConfig, 
        useValue: authConfig 
    },
    {
      provide: OAuthStorage,
      useFactory: storageFactory,
    },
    provideHttpClient(
      withInterceptorsFromDi(),
      withXsrfConfiguration({
        cookieName: 'XSRF-TOKEN',
        headerName: 'X-XSRF-TOKEN',
      })
    ),    
    provideEnvironmentInitializer(() => {
        inject(AppAuthService).initAuth().finally()}
    )  
  ]
};
