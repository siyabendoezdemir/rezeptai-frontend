import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { RecipeDetailsComponent } from './features/recipe-details/recipe-details.component';
import { NoAccessComponent } from './features/no-access/no-access.component';
import { AdminAuthGuard } from './core/guards/admin.auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'recipe/:id',
    component: RecipeDetailsComponent
  },
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.module').then(m => m.AdminModule),
    canActivate: [AdminAuthGuard]
  },
  { path: 'no-access', component: NoAccessComponent },
  { path: '**', redirectTo: '' }
];
