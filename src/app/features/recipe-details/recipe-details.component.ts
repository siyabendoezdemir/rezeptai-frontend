import { Component, OnInit } from '@angular/core';
import { CommonModule, ViewportScroller } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { RecipeService, Recipe } from '../../core/services/recipe.service';
import { NAVBAR_LINKS, NavbarLink } from '../../core/config/navbar-links.config';
import { MarkdownRendererComponent } from '../../shared/components/markdown-renderer/markdown-renderer.component';
import { RecipeCardComponent } from '../../shared/components/recipe-card/recipe-card.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recipe-details',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    MarkdownRendererComponent, 
    RecipeCardComponent
  ],
  templateUrl: './recipe-details.component.html',
  styleUrls: ['./recipe-details.component.scss']
})
export class RecipeDetailsComponent implements OnInit {
  recipe: Recipe | null = null;
  moreRecipes: Recipe[] = [];
  loading = true;
  error: string | null = null;
  public navbarLinks: NavbarLink[] = NAVBAR_LINKS;

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService,
    private viewportScroller: ViewportScroller,
    private router: Router
  ) {}

  ngOnInit() {
    this.viewportScroller.scrollToPosition([0, 0]);
    
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.loading = true;
        this.recipe = null;
        this.moreRecipes = [];
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
        this.loadMoreRecipes();
      },
      error: (error) => {
        console.error('Error loading recipe:', error);
        this.error = 'Failed to load recipe details. Please try again later.';
        this.loading = false;
      }
    });
  }

  private loadMoreRecipes() {
    this.recipeService.getRecipes().subscribe({
      next: (response) => {
        let allRecipes = response.content;
        if (this.recipe && this.recipe.id) {
          allRecipes = allRecipes.filter(r => r.id !== this.recipe!.id);
        }
        this.moreRecipes = this.shuffleArray(allRecipes).slice(0, 3);
      },
      error: (error) => {
        console.error('Error loading more recipes:', error);
      }
    });
  }

  private shuffleArray<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  navigateToRecipe(id: number) {
    // Navigate to the new recipe detail page
    // The ngOnInit logic will handle reloading and scrolling to top
    this.router.navigate(['/recipe', id]);
  }
} 