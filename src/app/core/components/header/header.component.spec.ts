import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { OAuthModule, AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { authConfig } from '../../../app.auth';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { AuthService } from '../../services/auth.service';
import { of } from 'rxjs';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['getIdentityClaims', 'logout'], {
      'isAuthenticated$': of(false)
    });
    mockAuthService.getIdentityClaims.and.returnValue(of({}));

    await TestBed.configureTestingModule({
      imports: [
        HeaderComponent,
        HttpClientTestingModule,
        OAuthModule.forRoot()
      ],
      providers: [
        { provide: AuthConfig, useValue: authConfig },
        JwtHelperService,
        { provide: JWT_OPTIONS, useValue: { tokenGetter: () => '', allowedDomains: [], disallowedRoutes: [] } },
        { provide: AuthService, useValue: mockAuthService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
