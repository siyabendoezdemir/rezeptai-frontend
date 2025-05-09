import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { RecipeDetailsComponent } from './features/recipe-details/recipe-details.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'recipe/:id',
    component: RecipeDetailsComponent
  },
  { path: '**', redirectTo: '' }
];
