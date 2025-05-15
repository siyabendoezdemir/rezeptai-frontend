import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';

interface UserInfo {
  name?: string;
  email?: string;
}

@Component({
  selector: 'app-user-menu',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="user-menu" *ngIf="isOpen" [@menuAnimation]="isOpen ? 'open' : 'closed'">
      <div class="user-info">
        <div class="user-avatar">
          <span>{{ userInfo?.name?.charAt(0)?.toUpperCase() || 'U' }}</span>
        </div>
        <div class="user-details">
          <div class="user-name">{{ userInfo?.name || 'User' }}</div>
          <div class="user-email">{{ userInfo?.email || '' }}</div>
        </div>
      </div>
      <div class="menu-divider"></div>
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
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      min-width: 240px;
      overflow: hidden;
      z-index: 1000;
    }

    .user-info {
      padding: 16px;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .user-avatar {
      width: 40px;
      height: 40px;
      background: #000;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 500;
    }

    .user-details {
      flex: 1;
      min-width: 0;
    }

    .user-name {
      font-weight: 500;
      color: #111;
      margin-bottom: 4px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .user-email {
      font-size: 0.875rem;
      color: #666;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .menu-divider {
      height: 1px;
      background: #eee;
      margin: 0;
    }

    .logout-button {
      width: 100%;
      padding: 12px 16px;
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
      })),
      state('open', style({
        opacity: 1,
        transform: 'translateY(0)',
      })),
      transition('closed <=> open', [
        animate('200ms cubic-bezier(0.4, 0, 0.2, 1)')
      ])
    ])
  ]
})
export class UserMenuComponent implements OnChanges {
  @Input() isOpen = false;
  @Input() userInfo: UserInfo = {};
  @Output() logout = new EventEmitter<void>();

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (this.isOpen) {
      this.cdr.detectChanges();
    }
  }

  onLogout() {
    this.logout.emit();
  }
} 