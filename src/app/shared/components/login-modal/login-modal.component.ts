import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="login-modal-backdrop" (click)="onBackdropClick($event)">
      <div class="login-modal-box">
        <div class="login-modal-hero">
          <div class="decor decor1"></div>
          <div class="decor decor2"></div>
          <h2 class="hero-title">Koch-Magie freisetzen</h2>
          <p class="hero-subtitle">Erstelle personalisierte Rezepte aus deinen Zutaten – nur einen Login entfernt.</p>
        </div>
        <div class="login-modal-content">
          <div class="benefits-row">
            <div class="benefit" *ngFor="let b of benefits">
              <div class="benefit-icon">{{ b.emoji }}</div>
              <div class="benefit-text">{{ b.text }}</div>
            </div>
          </div>
          <div class="action-section">
            <p class="cta-text">Erstelle jetzt dein kostenloses Konto, um zu beginnen:</p>
            <button class="login-btn" (click)="onLogin()">
              <span class="shine"></span>
              <span class="login-btn-content">Kostenlos anmelden <span class="arrow">→</span></span>
            </button>
            <p class="no-account">Keine Kreditkarte erforderlich. Sofortiger Zugriff.</p>
          </div>
        </div>
        <button class="close-btn" (click)="onClose()">×</button>
      </div>
    </div>
  `,
  styleUrls: ['./login-modal.component.scss']
})
export class LoginModalComponent {
  @Output() close = new EventEmitter<void>();
  @Output() login = new EventEmitter<void>();

  benefits = [
    { emoji: '🔍', text: 'Persönliche Rezepte' },
    { emoji: '⭐', text: 'Alle Rezepte speichern' },
    { emoji: '📊', text: 'Koch-Statistiken' },
    { emoji: '✨', text: 'Neue Funktionen' }
  ];

  constructor(private authService: AuthService) {}

  onBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }

  onClose() {
    this.close.emit();
  }

  onLogin() {
    this.authService.login();
    this.login.emit();
  }
} 