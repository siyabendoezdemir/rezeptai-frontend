import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

export interface Recipe {
  id: number;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string; // Contains markdown content for recipe steps
  preparationTime: number;
  cookingTime: number;
  servings: number;
  createdBy: string;
  createdAt: number[];
  updatedAt: number[];
}

export interface RecipeResponse {
  content: Recipe[];
}

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private apiUrl = 'http://localhost:9090/api/recipes';

  constructor(private http: HttpClient) {}

  getRecipes(): Observable<RecipeResponse> {
    console.log('Fetching recipes from:', this.apiUrl);
    return this.http.get<RecipeResponse>(this.apiUrl).pipe(
      tap(response => console.log('API Response:', response)),
      catchError(this.handleError)
    );
  }

  getRecipeById(id: string): Observable<Recipe> {
    const url = `${this.apiUrl}/${id}`;
    console.log('Fetching recipe from:', url);
    return this.http.get<Recipe>(url).pipe(
      tap(response => console.log('API Response:', response)),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('API Error:', {
      url: error.url,
      status: error.status,
      statusText: error.statusText,
      error: error.error
    });

    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    
    return throwError(() => error);
  }
} 