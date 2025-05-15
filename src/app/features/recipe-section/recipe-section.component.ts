import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecipeCardComponent } from '../../shared/components/recipe-card/recipe-card.component';
import { RecipeService, Recipe } from '../../core/services/recipe.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, NavigationEnd } from '@angular/router';
import { filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-recipe-section',
  standalone: true,
  imports: [CommonModule, RecipeCardComponent],
  templateUrl: './recipe-section.component.html',
  styleUrls: ['./recipe-section.component.scss']
})
export class RecipeSectionComponent implements OnInit, OnDestroy {
  recipes: Recipe[] = [];
  loading = true;
  error: string | null = null;
  private routerSubscription: Subscription;

  // Pagination properties
  currentPage = 0;
  pageSize = 9;
  totalPages = 0;
  totalElements = 0;

  constructor(
    private recipeService: RecipeService,
    private router: Router
  ) {
    // Subscribe to router events to reload recipes when navigating back to home
    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      if (event.url === '/') {
        this.loadRecipes();
      }
    });
  }

  ngOnInit() {
    this.loadRecipes();
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  private loadRecipes() {
    this.loading = true;
    this.recipeService.getRecipes(this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        console.log('Recipes loaded successfully:', response);
        this.recipes = response.content
          .sort((a: Recipe, b: Recipe) => {
            const dateA = new Date(a.createdAt[0], a.createdAt[1] - 1, a.createdAt[2], a.createdAt[3] || 0, a.createdAt[4] || 0, a.createdAt[5] || 0);
            const dateB = new Date(b.createdAt[0], b.createdAt[1] - 1, b.createdAt[2], b.createdAt[3] || 0, b.createdAt[4] || 0, b.createdAt[5] || 0);
            return dateB.getTime() - dateA.getTime();
          });
        // Removed .slice(0, 9) as pagination is now handled by the API
        this.totalPages = response.totalPages;
        this.totalElements = response.totalElements;
        this.currentPage = response.number; // API returns current page (0-indexed)
        this.pageSize = response.size;
        this.loading = false;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error loading recipes:', {
          status: error.status,
          statusText: error.statusText,
          error: error.error,
          message: error.message
        });
        this.error = `Failed to load recipes (${error.status}): ${error.statusText}`;
        this.loading = false;
      }
    });
  }

  // Pagination methods
  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadRecipes();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadRecipes();
    }
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadRecipes();
    }
  }

  getPages(): number[] {
    const pages = [];
    for (let i = 0; i < this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }
}
