import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { RecipeService, Recipe } from '../../core/services/recipe.service';
import { NAVBAR_LINKS, NavbarLink } from '../../core/config/navbar-links.config';
import { RouterModule } from '@angular/router';
import { MarkdownRendererComponent } from '../../shared/components/markdown-renderer/markdown-renderer.component';

@Component({
  selector: 'app-recipe-details',
  standalone: true,
  imports: [CommonModule, RouterModule, MarkdownRendererComponent],
  templateUrl: './recipe-details.component.html',
  styleUrls: ['./recipe-details.component.scss']
})
export class RecipeDetailsComponent implements OnInit {
  recipe: Recipe | null = null;
  loading = true;
  error: string | null = null;
  public navbarLinks: NavbarLink[] = NAVBAR_LINKS;

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.loadRecipe(id);
      }
    });
  }

  get totalTime(): number | null {
    if (this.recipe && typeof this.recipe.preparationTime === 'number' && typeof this.recipe.cookingTime === 'number') {
      return this.recipe.preparationTime + this.recipe.cookingTime;
    }
    return null;
  }

  get createdAtDate(): Date | null {
    if (this.recipe && Array.isArray(this.recipe.createdAt) && this.recipe.createdAt.length >= 3) {
      // [year, month, day, hour?, minute?, second?, ms?]
      const [year, month, day, hour = 0, minute = 0, second = 0, ms = 0] = this.recipe.createdAt;
      return new Date(year, month - 1, day, hour, minute, second, ms);
    }
    return null;
  }

  private loadRecipe(id: string) {
    this.recipeService.getRecipeById(id).subscribe({
      next: (recipe) => {
        this.recipe = recipe;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading recipe:', error);
        this.error = 'Failed to load recipe details. Please try again later.';
        this.loading = false;
      }
    });
  }
} 