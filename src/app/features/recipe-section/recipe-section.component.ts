import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecipeCardComponent } from '../../shared/components/recipe-card/recipe-card.component';
import { RecipeService, Recipe } from '../../core/services/recipe.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-recipe-section',
  standalone: true,
  imports: [CommonModule, RecipeCardComponent],
  templateUrl: './recipe-section.component.html',
  styleUrls: ['./recipe-section.component.scss']
})
export class RecipeSectionComponent implements OnInit {
  recipes: Recipe[] = [];
  loading = true;
  error: string | null = null;

  constructor(private recipeService: RecipeService) {}

  ngOnInit() {
    this.loadRecipes();
  }

  private loadRecipes() {
    this.recipeService.getRecipes().subscribe({
      next: (response) => {
        console.log('Recipes loaded successfully:', response);
        this.recipes = response.content
          .sort((a: Recipe, b: Recipe) => {
            const dateA = new Date(a.createdAt[0], a.createdAt[1] - 1, a.createdAt[2], a.createdAt[3] || 0, a.createdAt[4] || 0, a.createdAt[5] || 0);
            const dateB = new Date(b.createdAt[0], b.createdAt[1] - 1, b.createdAt[2], b.createdAt[3] || 0, b.createdAt[4] || 0, b.createdAt[5] || 0);
            return dateB.getTime() - dateA.getTime();
          })
          .slice(0, 9);
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
}
