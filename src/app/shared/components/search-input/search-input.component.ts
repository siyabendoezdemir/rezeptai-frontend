import { Component, AfterViewInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginModalComponent } from '../login-modal/login-modal.component';
import { AuthService } from '../../../core/services/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';

interface RecipeGenerationResponse {
  id: string;
  // Add other expected fields from the response if necessary
}

@Component({
  selector: 'app-search-input',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, LoginModalComponent],
  templateUrl: './search-input.component.html',
  styleUrl: './search-input.component.scss'
})
export class SearchInputComponent implements AfterViewInit {
  @ViewChild('inputTextarea') textareaElement!: ElementRef;
  
  private drawerElement: HTMLElement | null = null;
  showLoginModal = false;
  isLoading = false;

  constructor(
    private renderer: Renderer2,
    private authService: AuthService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngAfterViewInit() {
    this.setupAutoResize();
  }

  setupAutoResize() {
    const textarea = this.textareaElement.nativeElement;
    
    textarea.addEventListener('input', () => {
      textarea.style.height = 'auto';
      const maxHeight = window.innerHeight * 0.3 - 70; 
      const newHeight = Math.min(textarea.scrollHeight, maxHeight);
      textarea.style.height = newHeight + 'px';
    });
  }

  onSend(event: Event) {
    event.preventDefault();
    const prompt: string = this.textareaElement.nativeElement.value.trim();

    if (!prompt) {
      alert('Please enter your ingredients or a recipe idea.');
      return;
    }
    
    if (this.authService.isLoggedIn()) {
      this.isLoading = true;
      this.createDrawerInBody();
      this.renderer.setStyle(document.body, 'overflow', 'hidden');

      const headers = new HttpHeaders({ 'Content-Type': 'text/plain' });

      this.http.post<RecipeGenerationResponse>(
        'http://localhost:9090/api/ai/recipes/generate',
        prompt,
        { headers: headers }
      )
        .pipe(
          finalize(() => {
            this.isLoading = false;
            this.removeDrawerFromBody();
            this.renderer.setStyle(document.body, 'overflow', 'auto');
            this.textareaElement.nativeElement.value = '';
            this.textareaElement.nativeElement.style.height = 'auto';
          })
        )
        .subscribe({
          next: (response) => {
            if (response && response.id) {
              this.router.navigate(['/recipe', response.id]);
            } else {
              console.error('Recipe ID not found in response:', response);
              alert('Could not retrieve the generated recipe. Please try again.');
            }
          },
          error: (err) => {
            console.error('Error generating recipe:', err);
            const errorMessage = err.error instanceof ProgressEvent || typeof err.error === 'string' 
                               ? 'An error occurred. Please check backend logs.' 
                               : err.error?.message || 'An error occurred while generating the recipe. Please try again.';
            alert(errorMessage);
          }
        });
    } else {
      this.showLoginModal = true;
    }
  }

  onLoginModalClose() {
    this.showLoginModal = false;
  }

  onLogin() {
    this.showLoginModal = false;
    const prompt = this.textareaElement.nativeElement.value.trim();
    if (prompt) {
      this.onSend(new Event('submit'));
    }
  }
  
  private createDrawerInBody() {
    if (this.drawerElement) return;

    this.drawerElement = this.renderer.createElement('div');
    this.renderer.addClass(this.drawerElement, 'body-level-drawer');
    
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
    
    const loadingText = this.renderer.createElement('div');
    this.renderer.setStyle(loadingText, 'font-size', '1.3rem');
    this.renderer.setStyle(loadingText, 'color', '#444');
    this.renderer.setStyle(loadingText, 'font-weight', '500');
    const loadingTextContent = this.renderer.createText('Rezept wird generiert...');
    this.renderer.appendChild(loadingText, loadingTextContent);
    
    this.renderer.appendChild(spinnerContainer, spinner);
    this.renderer.appendChild(spinnerContainer, loadingText);
    
    this.renderer.appendChild(this.drawerElement, spinnerContainer);
    
    this.renderer.appendChild(document.body, this.drawerElement);
  }
  
  private removeDrawerFromBody() {
    if (this.drawerElement) {
      this.renderer.removeChild(document.body, this.drawerElement);
      this.drawerElement = null;
    }
  }
}
