import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchInputComponent } from './search-input.component';
import { OAuthModule, AuthConfig } from 'angular-oauth2-oidc';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { authConfig } from '../../../app.auth'; // Adjust path if necessary, assuming app.auth.ts is in src/app
import { JwtHelperService } from '@auth0/angular-jwt';

describe('SearchInputComponent', () => {
  let component: SearchInputComponent;
  let fixture: ComponentFixture<SearchInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SearchInputComponent,
        HttpClientTestingModule,
        OAuthModule.forRoot()
      ],
      providers: [
        { provide: AuthConfig, useValue: authConfig },
        JwtHelperService
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
