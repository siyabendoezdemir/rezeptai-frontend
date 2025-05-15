import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-user-menu',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="user-menu" *ngIf="isOpen" [@menuAnimation]="isOpen ? 'open' : 'closed'">
      <button class="logout-button" (click)="onLogout()">
        <span class="material-icons">logout</span>
        Abmelden
      </button>
    </div>
  `,
  styles: [`
    .user-menu {
      position: absolute;
      top: calc(100% + 8px);
      right: 0;
      background: white;
      border-radius: 8px; /* Adjusted for a smaller popover */
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      min-width: auto; /* Adjusted for a smaller popover */
      width: 160px; /* Set a fixed width or adjust as needed */
      overflow: hidden;
      z-index: 1000;
    }

    .logout-button {
      width: 100%;
      padding: 10px 12px; /* Adjusted padding */
      display: flex;
      align-items: center;
      gap: 8px;
      background: none;
      border: none;
      color: #dc3545;
      font-size: 0.875rem;
      cursor: pointer;
      transition: background-color 0.2s;

      &:hover {
        background-color: #fff5f5;
      }

      .material-icons {
        font-size: 18px;
      }
    }
  `],
  animations: [
    trigger('menuAnimation', [
      state('closed', style({
        opacity: 0,
        transform: 'translateY(-10px)',
        visibility: 'hidden'
      })),
      state('open', style({
        opacity: 1,
        transform: 'translateY(0)',
        visibility: 'visible'
      })),
      transition('closed => open', [
        animate('200ms cubic-bezier(0.4, 0, 0.2, 1)')
      ]),
      transition('open => closed', [
        animate('150ms cubic-bezier(0.4, 0, 0.2, 1)')
      ])
    ])
  ]
})
export class UserMenuComponent {
  @Input() isOpen = false;
  @Output() logout = new EventEmitter<void>();

  onLogout() {
    this.logout.emit();
  }
} 