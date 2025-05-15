import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { LoginModalComponent } from '../../../shared/components/login-modal/login-modal.component';
import { UserMenuComponent } from '../../../shared/components/user-menu/user-menu.component';
import { Observable } from 'rxjs';

interface IdentityClaims {
  name?: string;
  email?: string;
  sub?: string;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, LoginModalComponent, UserMenuComponent],
  template: `
    <header class="header">
      <div class="header-content">
        <div class="logo">
          <h1>RezeptAI</h1>
        </div>
        <div class="user-profile">
          @if (isAuthenticated$ | async) {
            <div class="avatar-container">
              <div class="avatar" (click)="toggleUserMenu($event)">
                <div class="avatar-placeholder">
                  <span>{{ userInitial }}</span>
                </div>
              </div>
              <app-user-menu
                [isOpen]="isUserMenuOpen"
                [userInfo]="userInfo"
                (logout)="onLogout()"
              ></app-user-menu>
            </div>
          } @else {
            <button class="login-button" (click)="showLoginModal()">
              Anmelden
            </button>
          }
        </div>
      </div>
    </header>
    @if (showModal) {
      <app-login-modal (close)="closeLoginModal()" (login)="onLogin()"></app-login-modal>
    }
  `,
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  showModal = false;
  userInitial = 'U';
  isAuthenticated$: Observable<boolean>;
  isUserMenuOpen = false;
  userInfo: { name?: string; email?: string } = {};

  constructor(private authService: AuthService) {
    this.isAuthenticated$ = this.authService.isAuthenticated$;
  }

  ngOnInit() {
    this.authService.getIdentityClaims().subscribe((claims: IdentityClaims) => {
      if (claims) {
        this.userInfo = {
          name: claims.name,
          email: claims.email
        };
        if (claims.name) {
          this.userInitial = claims.name.charAt(0).toUpperCase();
        }
      }
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const avatarContainer = target.closest('.avatar-container');
    const userMenu = target.closest('app-user-menu');
    
    if (!avatarContainer && !userMenu) {
      this.isUserMenuOpen = false;
    }
  }

  toggleUserMenu(event: MouseEvent) {
    event.stopPropagation();
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  showLoginModal() {
    this.showModal = true;
  }

  closeLoginModal() {
    this.showModal = false;
  }

  onLogin() {
    this.closeLoginModal();
  }

  onLogout() {
    this.authService.logout();
    this.isUserMenuOpen = false;
  }
}
