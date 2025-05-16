import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RecipeService, RecipeResponse, Recipe } from './recipe.service';
import { AppAuthService } from './app.auth.service';
import { HttpErrorResponse } from '@angular/common/http';

describe('RecipeService', () => {
  let service: RecipeService;
  let httpMock: HttpTestingController;
  let mockAppAuthService: jasmine.SpyObj<AppAuthService>;

  const mockRecipe: Recipe = {
    id: 1,
    title: 'Test Recipe',
    description: 'A delicious test recipe',
    ingredients: ['1 cup test ingredient'],
    instructions: 'Test instructions',
    preparationTime: 10,
    cookingTime: 20,
    servings: 2,
    createdBy: 'testUser',
    createdAt: [2023, 1, 1, 10, 0, 0],
    updatedAt: [2023, 1, 1, 10, 0, 0],
  };

  const mockRecipeResponse: RecipeResponse = {
    content: [mockRecipe],
    totalPages: 1,
    totalElements: 1,
    number: 0,
    size: 1,
  };

  beforeEach(() => {
    // AppAuthService methods that might be spied on if needed by RecipeService directly (excluding getters for spyOnProperty)
    mockAppAuthService = jasmine.createSpyObj('AppAuthService', ['isAuthenticated', 'login', 'logout'], ['accessToken']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        RecipeService,
        { provide: AppAuthService, useValue: mockAppAuthService }
      ]
    });
    service = TestBed.inject(RecipeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verify that no unmatched requests are outstanding.
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getRecipes', () => {
    it('should return an Observable<RecipeResponse> with recipes', () => {
      const page = 0;
      const size = 9;
      service.getRecipes(page, size).subscribe(response => {
        expect(response).toEqual(mockRecipeResponse);
        expect(response.content.length).toBe(1);
        expect(response.content[0].title).toBe('Test Recipe');
      });

      const req = httpMock.expectOne(`${service['apiUrl']}?page=${page}&size=${size}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockRecipeResponse);
    });

    it('should handle HTTP errors when fetching recipes', () => {
      const page = 0;
      const size = 9;
      const errorMessage = 'Http failure response for (unknown url): 404 Not Found';
      const mockError = new HttpErrorResponse({
        error: '404 error',
        status: 404,
        statusText: 'Not Found'
      });

      service.getRecipes(page, size).subscribe({
        next: () => fail('should have failed with the 404 error'),
        error: (error: Error) => {
          expect(error.message).toContain('Error Code: 404');
        }
      });

      const req = httpMock.expectOne(`${service['apiUrl']}?page=${page}&size=${size}`);
      expect(req.request.method).toBe('GET');
      req.flush('404 error', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('getRecipeById', () => {
    it('should return an Observable<Recipe> for a given ID', () => {
      const recipeId = '1';
      service.getRecipeById(recipeId).subscribe(recipe => {
        expect(recipe).toEqual(mockRecipe);
        expect(recipe.title).toBe('Test Recipe');
      });

      const req = httpMock.expectOne(`${service['apiUrl']}/${recipeId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockRecipe);
    });

    it('should handle HTTP errors when fetching a recipe by ID', () => {
      const recipeId = '99'; // Non-existent ID
      const mockError = new HttpErrorResponse({
        error: 'Recipe not found',
        status: 404,
        statusText: 'Not Found'
      });

      service.getRecipeById(recipeId).subscribe({
        next: () => fail('should have failed with the 404 error'),
        error: (error: Error) => {
          expect(error.message).toContain('Error Code: 404');
        }
      });
      
      const req = httpMock.expectOne(`${service['apiUrl']}/${recipeId}`);
      expect(req.request.method).toBe('GET');
      req.flush('Recipe not found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('deleteRecipe', () => {
    it('should send a DELETE request to the correct URL with auth token', () => {
      const recipeId = '1';
      const mockToken = 'test-token';
      (Object.getOwnPropertyDescriptor(mockAppAuthService, 'accessToken')?.get as jasmine.Spy).and.returnValue(mockToken);

      service.deleteRecipe(recipeId).subscribe();

      const req = httpMock.expectOne(`${service['apiUrl']}/${recipeId}`);
      expect(req.request.method).toBe('DELETE');
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
      req.flush(null, { status: 204, statusText: 'No Content' }); // Or 200 OK depending on API
    });

    it('should return an error if no access token is available', () => {
      const recipeId = '1';
      (Object.getOwnPropertyDescriptor(mockAppAuthService, 'accessToken')?.get as jasmine.Spy).and.returnValue('');

      service.deleteRecipe(recipeId).subscribe({
        next: () => fail('should have failed due to no token'),
        error: (error: Error) => {
          expect(error.message).toBe('No access token available. Please log in.');
        }
      });

      httpMock.expectNone(`${service['apiUrl']}/${recipeId}`); // Ensure no HTTP call is made
    });

    it('should handle HTTP errors during delete', () => {
      const recipeId = '1';
      const mockToken = 'test-token';
      (Object.getOwnPropertyDescriptor(mockAppAuthService, 'accessToken')?.get as jasmine.Spy).and.returnValue(mockToken);

      const mockError = new HttpErrorResponse({
        error: 'Deletion failed',
        status: 500,
        statusText: 'Internal Server Error'
      });

      service.deleteRecipe(recipeId).subscribe({
        next: () => fail('should have failed with a 500 error'),
        error: (error: Error) => {
          expect(error.message).toContain('Error Code: 500');
        }
      });

      const req = httpMock.expectOne(`${service['apiUrl']}/${recipeId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush('Deletion failed', { status: 500, statusText: 'Internal Server Error' });
    });
  });
}); 