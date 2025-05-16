import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { OAuthModule, AuthConfig } from 'angular-oauth2-oidc';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { authConfig } from '../../app.auth'; // Adjust path: from src/app/features/home to src/app
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { AuthService } from '../../core/services/auth.service'; // Import AuthService
import { of } from 'rxjs'; // Import 'of' for creating observables

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>; // Declare mockAuthService

  beforeEach(async () => {
    // Create a spy object for AuthService
    mockAuthService = jasmine.createSpyObj('AuthService', ['getIdentityClaims', 'logout'], {
      'isAuthenticated$': of(false) // Mock isAuthenticated$ as an Observable
    });
    // Mock getIdentityClaims to return an empty object observable
    mockAuthService.getIdentityClaims.and.returnValue(of({}));

    await TestBed.configureTestingModule({
      imports: [
        HomeComponent,
        HttpClientTestingModule,
        OAuthModule.forRoot()
      ],
      providers: [
        { provide: AuthConfig, useValue: authConfig },
        JwtHelperService,
        { provide: JWT_OPTIONS, useValue: { tokenGetter: () => '', allowedDomains: [], disallowedRoutes: [] } },
        { provide: AuthService, useValue: mockAuthService } // Provide the mock AuthService
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
