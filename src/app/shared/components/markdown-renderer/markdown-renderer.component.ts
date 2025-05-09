import { Component, Input, OnChanges, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarkdownModule } from 'ngx-markdown';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-markdown-renderer',
  standalone: true,
  imports: [CommonModule, MarkdownModule, RouterModule],
  template: `
    <div class="markdown-content">
      <markdown [data]="content" (ready)="onReady()"></markdown>
    </div>
  `,
  styleUrls: ['./markdown-renderer.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MarkdownRendererComponent implements OnChanges {
  @Input() content: string = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['content'] && !changes['content'].firstChange) {
      this.content = changes['content'].currentValue;
    }
  }

  onReady(): void {
    // Optional: Add any post-render processing here
    // For example, you could add animation classes to elements
  }
} 