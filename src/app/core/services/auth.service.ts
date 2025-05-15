import { Injectable } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, Observable } from 'rxjs';
import { authConfig } from '../../app.auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private oauthService: OAuthService,
    private jwtHelper: JwtHelperService
  ) {
    this.configureOAuth();
  }

  private configureOAuth() {
    this.oauthService.configure(authConfig);

    this.oauthService.events.subscribe(event => {
      if (event.type === 'token_received') {
        this.isAuthenticatedSubject.next(true);
      } else if (event.type === 'logout') {
        this.isAuthenticatedSubject.next(false);
      }
    });

    this.oauthService.loadDiscoveryDocumentAndTryLogin().then(() => {
      if (this.oauthService.hasValidAccessToken()) {
        this.isAuthenticatedSubject.next(true);
      }
    }).catch(err => {
      console.error('Error loading discovery document', err);
    });
  }

  public login(): void {
    this.oauthService.initCodeFlow();
  }

  public logout(): void {
    this.oauthService.logOut();
    this.isAuthenticatedSubject.next(false);
  }

  public getAccessToken(): string {
    return this.oauthService.getAccessToken();
  }

  public getIdentityClaims(): any {
    return this.oauthService.getIdentityClaims();
  }

  public isLoggedIn(): boolean {
    return this.oauthService.hasValidAccessToken();
  }

  public async initAuth(): Promise<void> {
    try {
      await this.oauthService.loadDiscoveryDocument();
      await this.oauthService.tryLogin();
    } catch (error) {
      console.error('Error initializing auth', error);
    }
  }
} 