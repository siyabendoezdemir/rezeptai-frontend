import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-input',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './search-input.component.html',
  styleUrl: './search-input.component.scss'
})
export class SearchInputComponent implements AfterViewInit {
  @ViewChild('inputTextarea') textareaElement!: ElementRef;

  ngAfterViewInit() {
    this.setupAutoResize();
  }

  setupAutoResize() {
    const textarea = this.textareaElement.nativeElement;
    
    textarea.addEventListener('input', () => {
      // Reset height to auto to get the correct scrollHeight
      textarea.style.height = 'auto';
      
      // Set new height based on scrollHeight, but limit it
      const maxHeight = window.innerHeight * 0.3 - 70; // 30vh minus some padding
      const newHeight = Math.min(textarea.scrollHeight, maxHeight);
      textarea.style.height = newHeight + 'px';
    });
  }
}
