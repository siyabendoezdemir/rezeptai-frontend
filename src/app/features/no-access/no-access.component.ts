import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-no-access',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div style="text-align: center; padding: 4rem;">
      <h1>Access Denied</h1>
      <p>You do not have permission to view this page.</p>
      <a routerLink="/">Go to Homepage</a>
    </div>
  `,
  styles: [``]
})
export class NoAccessComponent {} 