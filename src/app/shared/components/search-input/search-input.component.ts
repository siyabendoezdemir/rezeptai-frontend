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
  private loginModalElement: HTMLElement | null = null;
  private isUserLoggedIn = false; // Replace with actual auth service check

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
    
    // Check if user is logged in
    if (this.isUserLoggedIn) {
      // User is logged in, show the loading drawer
      this.createDrawerInBody();
      
      // Prevent scrolling when drawer is open
      this.renderer.setStyle(document.body, 'overflow', 'hidden');
      
      // For demo: hide after 2 seconds
      setTimeout(() => {
        this.removeDrawerFromBody();
        // Re-enable scrolling when drawer is closed
        this.renderer.setStyle(document.body, 'overflow', 'auto');
      }, 2000);
    } else {
      // User is not logged in, show login modal
      this.showLoginModal();
    }
  }
  
  private showLoginModal() {
    // Prevent scrolling
    this.renderer.setStyle(document.body, 'overflow', 'hidden');
    
    // Create the modal backdrop
    this.loginModalElement = this.renderer.createElement('div');
    this.renderer.addClass(this.loginModalElement, 'login-modal-backdrop');
    
    // Set styles for backdrop
    this.renderer.setStyle(this.loginModalElement, 'position', 'fixed');
    this.renderer.setStyle(this.loginModalElement, 'top', '0');
    this.renderer.setStyle(this.loginModalElement, 'left', '0');
    this.renderer.setStyle(this.loginModalElement, 'width', '100%');
    this.renderer.setStyle(this.loginModalElement, 'height', '100%');
    this.renderer.setStyle(this.loginModalElement, 'background-color', 'rgba(0,0,0,0.6)');
    this.renderer.setStyle(this.loginModalElement, 'backdrop-filter', 'blur(5px)');
    this.renderer.setStyle(this.loginModalElement, 'z-index', '9999999');
    this.renderer.setStyle(this.loginModalElement, 'display', 'flex');
    this.renderer.setStyle(this.loginModalElement, 'align-items', 'center');
    this.renderer.setStyle(this.loginModalElement, 'justify-content', 'center');
    this.renderer.setStyle(this.loginModalElement, 'animation', 'fade-in 0.25s ease-out');
    
    // Create the modal box
    const modalBox = this.renderer.createElement('div');
    this.renderer.setStyle(modalBox, 'background-color', '#fff');
    this.renderer.setStyle(modalBox, 'border-radius', '24px');
    this.renderer.setStyle(modalBox, 'overflow', 'hidden');
    this.renderer.setStyle(modalBox, 'max-width', '550px');
    this.renderer.setStyle(modalBox, 'width', '92%');
    this.renderer.setStyle(modalBox, 'box-shadow', '0 25px 50px rgba(0,0,0,0.25)');
    this.renderer.setStyle(modalBox, 'transform', 'translateY(0)');
    this.renderer.setStyle(modalBox, 'animation', 'modal-slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1)');
    this.renderer.setStyle(modalBox, 'position', 'relative');
    
    // Create hero header
    const heroHeader = this.renderer.createElement('div');
    this.renderer.setStyle(heroHeader, 'background', 'linear-gradient(135deg, #FF8000, #FF9D45)');
    this.renderer.setStyle(heroHeader, 'padding', '2rem');
    this.renderer.setStyle(heroHeader, 'color', 'white');
    this.renderer.setStyle(heroHeader, 'position', 'relative');
    this.renderer.setStyle(heroHeader, 'overflow', 'hidden');
    
    // Add decorative elements to header
    const decor1 = this.renderer.createElement('div');
    this.renderer.setStyle(decor1, 'position', 'absolute');
    this.renderer.setStyle(decor1, 'width', '150px');
    this.renderer.setStyle(decor1, 'height', '150px');
    this.renderer.setStyle(decor1, 'background', 'rgba(255,255,255,0.1)');
    this.renderer.setStyle(decor1, 'border-radius', '50%');
    this.renderer.setStyle(decor1, 'top', '-30px');
    this.renderer.setStyle(decor1, 'right', '-30px');
    
    const decor2 = this.renderer.createElement('div');
    this.renderer.setStyle(decor2, 'position', 'absolute');
    this.renderer.setStyle(decor2, 'width', '80px');
    this.renderer.setStyle(decor2, 'height', '80px');
    this.renderer.setStyle(decor2, 'background', 'rgba(255,255,255,0.1)');
    this.renderer.setStyle(decor2, 'border-radius', '50%');
    this.renderer.setStyle(decor2, 'bottom', '20px');
    this.renderer.setStyle(decor2, 'left', '30px');
    
    // Modal hero title
    const heroTitle = this.renderer.createElement('h2');
    this.renderer.setStyle(heroTitle, 'font-size', '2rem');
    this.renderer.setStyle(heroTitle, 'font-weight', '800');
    this.renderer.setStyle(heroTitle, 'margin', '0 0 0.5rem 0');
    this.renderer.setStyle(heroTitle, 'position', 'relative');
    this.renderer.setStyle(heroTitle, 'z-index', '1');
    const heroTitleText = this.renderer.createText('Koch-Magie freisetzen');
    this.renderer.appendChild(heroTitle, heroTitleText);
    
    // Subtitle
    const heroSubtitle = this.renderer.createElement('p');
    this.renderer.setStyle(heroSubtitle, 'font-size', '1.1rem');
    this.renderer.setStyle(heroSubtitle, 'opacity', '0.95');
    this.renderer.setStyle(heroSubtitle, 'margin', '0');
    this.renderer.setStyle(heroSubtitle, 'position', 'relative');
    this.renderer.setStyle(heroSubtitle, 'z-index', '1');
    this.renderer.setStyle(heroSubtitle, 'max-width', '400px');
    const heroSubtitleText = this.renderer.createText('Erstelle personalisierte Rezepte aus deinen Zutaten – nur einen Login entfernt.');
    this.renderer.appendChild(heroSubtitle, heroSubtitleText);
    
    // Add elements to hero
    this.renderer.appendChild(heroHeader, decor1);
    this.renderer.appendChild(heroHeader, decor2);
    this.renderer.appendChild(heroHeader, heroTitle);
    this.renderer.appendChild(heroHeader, heroSubtitle);
    
    // Create content container
    const contentContainer = this.renderer.createElement('div');
    this.renderer.setStyle(contentContainer, 'padding', '2rem');
    
    // Benefits section
    const benefitsSection = this.renderer.createElement('div');
    this.renderer.setStyle(benefitsSection, 'margin-bottom', '1.5rem');
    
    // Benefits icon container
    const benefitsIconRow = this.renderer.createElement('div');
    this.renderer.setStyle(benefitsIconRow, 'display', 'flex');
    this.renderer.setStyle(benefitsIconRow, 'justify-content', 'space-between');
    this.renderer.setStyle(benefitsIconRow, 'text-align', 'center');
    this.renderer.setStyle(benefitsIconRow, 'margin-bottom', '1.75rem');
    
    // Create benefit icons (4)
    const benefitIcons = [
        { emoji: '🔍', text: 'Persönliche Rezepte' },
        { emoji: '⭐', text: 'Alle Rezepte speichern' },
        { emoji: '📊', text: 'Koch-Statistiken' },
        { emoji: '✨', text: 'Neue Funktionen' }
    ];
    
    benefitIcons.forEach(benefit => {
        const iconContainer = this.renderer.createElement('div');
        this.renderer.setStyle(iconContainer, 'width', '22%');
        
        const iconCircle = this.renderer.createElement('div');
        this.renderer.setStyle(iconCircle, 'width', '60px');
        this.renderer.setStyle(iconCircle, 'height', '60px');
        this.renderer.setStyle(iconCircle, 'background', 'rgba(255,128,0,0.1)');
        this.renderer.setStyle(iconCircle, 'border-radius', '50%');
        this.renderer.setStyle(iconCircle, 'display', 'flex');
        this.renderer.setStyle(iconCircle, 'align-items', 'center');
        this.renderer.setStyle(iconCircle, 'justify-content', 'center');
        this.renderer.setStyle(iconCircle, 'font-size', '1.8rem');
        this.renderer.setStyle(iconCircle, 'margin', '0 auto 0.75rem auto');
        
        const emojiText = this.renderer.createText(benefit.emoji);
        this.renderer.appendChild(iconCircle, emojiText);
        
        const benefitText = this.renderer.createElement('div');
        this.renderer.setStyle(benefitText, 'font-size', '0.85rem');
        this.renderer.setStyle(benefitText, 'font-weight', '600');
        this.renderer.setStyle(benefitText, 'color', '#444');
        
        const textContent = this.renderer.createText(benefit.text);
        this.renderer.appendChild(benefitText, textContent);
        
        this.renderer.appendChild(iconContainer, iconCircle);
        this.renderer.appendChild(iconContainer, benefitText);
        this.renderer.appendChild(benefitsIconRow, iconContainer);
    });
    
    // Action section
    const actionSection = this.renderer.createElement('div');
    this.renderer.setStyle(actionSection, 'text-align', 'center');
    
    // CTA text
    const ctaText = this.renderer.createElement('p');
    this.renderer.setStyle(ctaText, 'font-size', '1.1rem');
    this.renderer.setStyle(ctaText, 'font-weight', '500');
    this.renderer.setStyle(ctaText, 'color', '#333');
    this.renderer.setStyle(ctaText, 'margin-bottom', '1.25rem');
    const ctaTextContent = this.renderer.createText('Erstelle jetzt dein kostenloses Konto, um zu beginnen:');
    this.renderer.appendChild(ctaText, ctaTextContent);
    
    // Login button
    const loginButton = this.renderer.createElement('button');
    this.renderer.setStyle(loginButton, 'background', 'linear-gradient(to right, #FF8000, #FF9D45)');
    this.renderer.setStyle(loginButton, 'color', '#fff');
    this.renderer.setStyle(loginButton, 'border', 'none');
    this.renderer.setStyle(loginButton, 'border-radius', '12px');
    this.renderer.setStyle(loginButton, 'padding', '1rem 2rem');
    this.renderer.setStyle(loginButton, 'font-size', '1.1rem');
    this.renderer.setStyle(loginButton, 'font-weight', '700');
    this.renderer.setStyle(loginButton, 'cursor', 'pointer');
    this.renderer.setStyle(loginButton, 'width', '100%');
    this.renderer.setStyle(loginButton, 'box-shadow', '0 4px 12px rgba(255, 128, 0, 0.3)');
    this.renderer.setStyle(loginButton, 'transition', 'all 0.2s ease');
    this.renderer.setStyle(loginButton, 'margin-bottom', '1rem');
    this.renderer.setStyle(loginButton, 'position', 'relative');
    this.renderer.setStyle(loginButton, 'overflow', 'hidden');
    
    // Animated shine effect
    const shine = this.renderer.createElement('div');
    this.renderer.setStyle(shine, 'position', 'absolute');
    this.renderer.setStyle(shine, 'top', '0');
    this.renderer.setStyle(shine, 'left', '-100%');
    this.renderer.setStyle(shine, 'width', '100%');
    this.renderer.setStyle(shine, 'height', '100%');
    this.renderer.setStyle(shine, 'background', 'linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 100%)');
    this.renderer.setStyle(shine, 'animation', 'shine 3s infinite');
    
    // Login button text
    const loginButtonContent = this.renderer.createElement('div');
    this.renderer.setStyle(loginButtonContent, 'display', 'flex');
    this.renderer.setStyle(loginButtonContent, 'align-items', 'center');
    this.renderer.setStyle(loginButtonContent, 'justify-content', 'center');
    this.renderer.setStyle(loginButtonContent, 'gap', '0.75rem');
    
    // Login text
    const loginText = this.renderer.createText('Kostenlos anmelden');
    this.renderer.appendChild(loginButtonContent, loginText);
    
    // Arrow icon
    const arrow = this.renderer.createElement('span');
    this.renderer.setStyle(arrow, 'font-size', '1.2rem');
    const arrowText = this.renderer.createText('→');
    this.renderer.appendChild(arrow, arrowText);
    this.renderer.appendChild(loginButtonContent, arrow);
    
    // Add shine and content to button
    this.renderer.appendChild(loginButton, shine);
    this.renderer.appendChild(loginButton, loginButtonContent);
    
    // No account required notice
    const noAccountNotice = this.renderer.createElement('p');
    this.renderer.setStyle(noAccountNotice, 'font-size', '0.9rem');
    this.renderer.setStyle(noAccountNotice, 'color', '#666');
    this.renderer.setStyle(noAccountNotice, 'margin', '0');
    const noAccountText = this.renderer.createText('Keine Kreditkarte erforderlich. Sofortiger Zugriff.');
    this.renderer.appendChild(noAccountNotice, noAccountText);
    
    // Add listener to login button
    this.renderer.listen(loginButton, 'click', () => this.redirectToKeycloakLogin());
    
    // Close button
    const closeButton = this.renderer.createElement('button');
    this.renderer.setStyle(closeButton, 'position', 'absolute');
    this.renderer.setStyle(closeButton, 'top', '1rem');
    this.renderer.setStyle(closeButton, 'right', '1rem');
    this.renderer.setStyle(closeButton, 'background', 'rgba(0,0,0,0.2)');
    this.renderer.setStyle(closeButton, 'border', 'none');
    this.renderer.setStyle(closeButton, 'width', '30px');
    this.renderer.setStyle(closeButton, 'height', '30px');
    this.renderer.setStyle(closeButton, 'border-radius', '50%');
    this.renderer.setStyle(closeButton, 'display', 'flex');
    this.renderer.setStyle(closeButton, 'align-items', 'center');
    this.renderer.setStyle(closeButton, 'justify-content', 'center');
    this.renderer.setStyle(closeButton, 'font-size', '1.2rem');
    this.renderer.setStyle(closeButton, 'cursor', 'pointer');
    this.renderer.setStyle(closeButton, 'color', 'white');
    this.renderer.setStyle(closeButton, 'z-index', '5');
    const closeText = this.renderer.createText('×');
    this.renderer.appendChild(closeButton, closeText);
    
    // Add listener to close button
    this.renderer.listen(closeButton, 'click', () => this.closeLoginModal());
    
    // Add listener to backdrop for closing when clicking outside
    this.renderer.listen(this.loginModalElement, 'click', (event: Event) => {
      if (event.target === this.loginModalElement) {
        this.closeLoginModal();
      }
    });
    
    // Build the content section
    this.renderer.appendChild(actionSection, ctaText);
    this.renderer.appendChild(actionSection, loginButton);
    this.renderer.appendChild(actionSection, noAccountNotice);
    
    this.renderer.appendChild(benefitsSection, benefitsIconRow);
    this.renderer.appendChild(contentContainer, benefitsSection);
    this.renderer.appendChild(contentContainer, actionSection);
    
    // Build modal structure
    this.renderer.appendChild(modalBox, heroHeader);
    this.renderer.appendChild(modalBox, contentContainer);
    this.renderer.appendChild(modalBox, closeButton);
    
    // Add the modal to the backdrop
    this.renderer.appendChild(this.loginModalElement, modalBox);
    
    // Add to document body
    this.renderer.appendChild(document.body, this.loginModalElement);
  }
  
  private closeLoginModal() {
    if (this.loginModalElement) {
      this.renderer.removeChild(document.body, this.loginModalElement);
      this.loginModalElement = null;
      // Re-enable scrolling
      this.renderer.setStyle(document.body, 'overflow', 'auto');
    }
  }
  
  private redirectToKeycloakLogin() {
    // Here you would redirect to your Keycloak login
    // For now, just log a message
    console.log('Redirecting to Keycloak login...');
    window.location.href = '/auth'; // Replace with your actual Keycloak URL
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
