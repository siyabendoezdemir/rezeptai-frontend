import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Recipe } from '../../../core/services/recipe.service';

@Component({
  selector: 'app-recipe-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recipe-card.component.html',
  styleUrls: ['./recipe-card.component.scss']
})
export class RecipeCardComponent {
  @Input() recipe!: Recipe;

  constructor(private router: Router) {}

  get totalTime(): number {
    return this.recipe.preparationTime + this.recipe.cookingTime;
  }

  navigateToDetails() {
    this.router.navigate(['/recipe', this.recipe.id]);
  }
} 