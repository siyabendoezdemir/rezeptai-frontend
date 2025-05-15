import { Component, OnInit } from '@angular/core';
import { Recipe, RecipeService } from '../../core/services/recipe.service'; // Adjust path as needed
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule], // Will add FormsModule, etc. if needed for forms
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  recipes: Recipe[] = [];
  isLoading = false;
  error: string | null = null;

  constructor(private recipeService: RecipeService) { }

  ngOnInit(): void {
    this.loadRecipes();
  }

  loadRecipes(): void {
    this.isLoading = true;
    this.error = null;
    this.recipeService.getRecipes().subscribe({
      next: (response) => {
        this.recipes = response.content;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading recipes for admin', err);
        this.error = 'Failed to load recipes.';
        this.isLoading = false;
      }
    });
  }

  public formatDateFromArray(dateArray: number[] | undefined | null): Date | null {
    if (!dateArray || dateArray.length < 3) { // Need at least year, month, day
      return null;
    }
    // Assuming [year, month (1-indexed), day, hour, minute, second, ...]
    const year = dateArray[0];
    const month = dateArray[1] - 1; // Adjust month to be 0-indexed
    const day = dateArray[2];
    const hour = dateArray.length > 3 ? dateArray[3] : 0;
    const minute = dateArray.length > 4 ? dateArray[4] : 0;
    const second = dateArray.length > 5 ? dateArray[5] : 0;
    return new Date(year, month, day, hour, minute, second);
  }

  deleteRecipe(recipeId: string): void {
    // TODO: Implement confirmation dialog
    if (!confirm(`Are you sure you want to delete recipe with ID: ${recipeId}?`)) {
      return;
    }

    this.isLoading = true; // Optional: show loading state during delete
    this.recipeService.deleteRecipe(recipeId).subscribe({
      next: () => {
        console.log(`Recipe ${recipeId} deleted successfully from component.`);
        // Refresh the list of recipes
        this.recipes = this.recipes.filter(recipe => recipe.id.toString() !== recipeId);
        this.isLoading = false;
      },
      error: (err: Error) => {
        console.error(`Error deleting recipe ${recipeId}`, err);
        this.error = `Failed to delete recipe ${recipeId}. Server responded: ${err.message}`;
        this.isLoading = false;
      }
    });
  }
} 