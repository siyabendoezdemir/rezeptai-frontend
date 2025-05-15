import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AppAuthService } from '../services/app.auth.service'; // Adjust path as necessary

@Injectable({
  providedIn: 'root'
})
export class AdminAuthGuard implements CanActivate {
  constructor(private appAuthService: AppAuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    if (!this.appAuthService.isAuthenticated()) {
      // If not authenticated, redirect to login page or home
      // Potentially store the attempted URL to redirect back after login
      this.router.navigate(['/']); // Or a specific login page
      return false;
    }

    return this.appAuthService.getRoles().pipe(
      take(1),
      map(roles => {
        if (roles && roles.map(role => role.toLowerCase()).includes('admin')) {
          return true;
        }
        // If not admin, redirect to a 'no-access' page or home
        this.router.navigate(['/no-access']); // Or home '/'
        return false;
      })
    );
  }
} 