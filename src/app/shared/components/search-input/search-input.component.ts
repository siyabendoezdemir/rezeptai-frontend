import { Component, AfterViewInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
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
  
  private drawerElement: HTMLElement | null = null;

  constructor(private renderer: Renderer2) {}

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

  onSend(event: Event) {
    event.preventDefault();
    
    // Create drawer directly in the body
    this.createDrawerInBody();
    
    // Prevent scrolling when drawer is open
    this.renderer.setStyle(document.body, 'overflow', 'hidden');
    
    // For demo: hide after 2 seconds
    setTimeout(() => {
      this.removeDrawerFromBody();
      // Re-enable scrolling when drawer is closed
      this.renderer.setStyle(document.body, 'overflow', 'auto');
    }, 2000);
  }
  
  private createDrawerInBody() {
    // Create the drawer element
    this.drawerElement = this.renderer.createElement('div');
    this.renderer.addClass(this.drawerElement, 'body-level-drawer');
    
    // Set styles directly
    this.renderer.setStyle(this.drawerElement, 'position', 'fixed');
    this.renderer.setStyle(this.drawerElement, 'top', '0');
    this.renderer.setStyle(this.drawerElement, 'left', '0');
    this.renderer.setStyle(this.drawerElement, 'width', '100%');
    this.renderer.setStyle(this.drawerElement, 'height', '100%');
    this.renderer.setStyle(this.drawerElement, 'background-color', '#fff');
    this.renderer.setStyle(this.drawerElement, 'z-index', '9999999');
    this.renderer.setStyle(this.drawerElement, 'display', 'flex');
    this.renderer.setStyle(this.drawerElement, 'align-items', 'center');
    this.renderer.setStyle(this.drawerElement, 'justify-content', 'center');
    this.renderer.setStyle(this.drawerElement, 'animation', 'drawer-slide-up 0.35s cubic-bezier(0.4,0,0.2,1)');
    
    // Create the spinner
    const spinnerContainer = this.renderer.createElement('div');
    this.renderer.setStyle(spinnerContainer, 'display', 'flex');
    this.renderer.setStyle(spinnerContainer, 'flex-direction', 'column');
    this.renderer.setStyle(spinnerContainer, 'align-items', 'center');
    
    const spinner = this.renderer.createElement('div');
    this.renderer.setStyle(spinner, 'width', '56px');
    this.renderer.setStyle(spinner, 'height', '56px');
    this.renderer.setStyle(spinner, 'border', '6px solid #eee');
    this.renderer.setStyle(spinner, 'border-top', '6px solid #FF8000');
    this.renderer.setStyle(spinner, 'border-radius', '50%');
    this.renderer.setStyle(spinner, 'animation', 'spin 1s linear infinite');
    this.renderer.setStyle(spinner, 'margin-bottom', '1.5rem');
    
    // Create the text
    const loadingText = this.renderer.createElement('div');
    this.renderer.setStyle(loadingText, 'font-size', '1.3rem');
    this.renderer.setStyle(loadingText, 'color', '#303030');
    this.renderer.setStyle(loadingText, 'font-weight', '600');
    
    const text = this.renderer.createText('Lade...');
    this.renderer.appendChild(loadingText, text);
    
    // Build the structure
    this.renderer.appendChild(spinnerContainer, spinner);
    this.renderer.appendChild(spinnerContainer, loadingText);
    this.renderer.appendChild(this.drawerElement, spinnerContainer);
    
    // Add to document body
    this.renderer.appendChild(document.body, this.drawerElement);
  }
  
  private removeDrawerFromBody() {
    if (this.drawerElement) {
      this.renderer.removeChild(document.body, this.drawerElement);
      this.drawerElement = null;
    }
  }
}
