import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CommonModule } from '@angular/common';
import { of, throwError, Subscription } from 'rxjs';
import { RecipeSectionComponent } from './recipe-section.component';
import { RecipeService, Recipe, RecipeResponse } from '../../core/services/recipe.service';
import { RecipeCardComponent } from '../../shared/components/recipe-card/recipe-card.component';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, NavigationEnd } from '@angular/router';

describe('RecipeSectionComponent', () => {
  let component: RecipeSectionComponent;
  let fixture: ComponentFixture<RecipeSectionComponent>;
  let mockRecipeService: jasmine.SpyObj<RecipeService>;
  let router: Router;

  const mockRecipe: Recipe = {
    id: 1,
    title: 'Test Recipe 1',
    description: 'Desc 1',
    ingredients: [],
    instructions: 'Instr 1',
    preparationTime: 10,
    cookingTime: 20,
    servings: 2,
    createdBy: 'user1',
    createdAt: [2023,1,1,12,0,0],
    updatedAt: [2023,1,1,12,0,0],
  };

  const mockRecipeResponse: RecipeResponse = {
    content: [mockRecipe],
    totalPages: 2,
    totalElements: 18, // e.g. 2 pages of 9
    number: 0, // current page
    size: 9, // page size
  };

  beforeEach(async () => {
    mockRecipeService = jasmine.createSpyObj('RecipeService', ['getRecipes']);

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        HttpClientTestingModule, // For RecipeService if not fully mocked or for other dependencies
        RouterTestingModule.withRoutes([]), // For router events
        RecipeSectionComponent, // Import standalone component
        // RecipeCardComponent, // RecipeCardComponent is standalone and imported by RecipeSectionComponent
      ],
      providers: [
        { provide: RecipeService, useValue: mockRecipeService },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RecipeSectionComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    mockRecipeService.getRecipes.and.returnValue(of(mockRecipeResponse)); // Default success response
    // fixture.detectChanges(); // ngOnInit is called here
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call loadRecipes on init', () => {
    spyOn(component as any, 'loadRecipes').and.callThrough();
    fixture.detectChanges(); // Triggers ngOnInit
    expect((component as any).loadRecipes).toHaveBeenCalled();
  });

  it('should load recipes on router navigation to "/"', fakeAsync(() => {
    spyOn(component as any, 'loadRecipes').and.callThrough();
    fixture.detectChanges(); // initial ngOnInit call
    expect((component as any).loadRecipes).toHaveBeenCalledTimes(1);

    (router.events as any).next(new NavigationEnd(0, '/', '/'));
    tick();
    fixture.detectChanges();

    expect((component as any).loadRecipes).toHaveBeenCalledTimes(2);
  }));

  describe('loadRecipes', () => {
    it('should load recipes successfully and update component properties', fakeAsync(() => {
      fixture.detectChanges(); // ngOnInit -> loadRecipes
      tick(); // Resolve the observable

      expect(component.loading).toBeFalse();
      expect(component.recipes.length).toBe(1);
      expect(component.recipes[0].title).toBe('Test Recipe 1');
      expect(component.totalPages).toBe(mockRecipeResponse.totalPages);
      expect(component.totalElements).toBe(mockRecipeResponse.totalElements);
      expect(component.currentPage).toBe(mockRecipeResponse.number);
      expect(component.pageSize).toBe(mockRecipeResponse.size);
      expect(component.error).toBeNull();
    }));

    it('should handle error when loading recipes', fakeAsync(() => {
      const errorResponse = new HttpErrorResponse({
        error: 'test 404 error',
        status: 404, statusText: 'Not Found'
      });
      mockRecipeService.getRecipes.and.returnValue(throwError(() => errorResponse));

      fixture.detectChanges(); // ngOnInit -> loadRecipes
      tick(); // Resolve the observable (error)

      expect(component.loading).toBeFalse();
      expect(component.recipes.length).toBe(0);
      expect(component.error).toBe(`Failed to load recipes (${errorResponse.status}): ${errorResponse.statusText}`);
    }));
  });

  describe('pagination methods', () => {
    beforeEach(fakeAsync(() => {
      fixture.detectChanges(); // initial load
      tick();
    }));

    it('goToPage should update currentPage and call loadRecipes if page is valid', () => {
      spyOn(component as any, 'loadRecipes'); // Don't call through, just spy
      const targetPage = 1;
      component.goToPage(targetPage);
      expect(component.currentPage).toBe(targetPage);
      expect((component as any).loadRecipes).toHaveBeenCalledTimes(1);
    });

    it('goToPage should not call loadRecipes if page is invalid (less than 0)', () => {
      spyOn(component as any, 'loadRecipes');
      component.goToPage(-1);
      expect(component.currentPage).toBe(0); // Should not change from initial
      expect((component as any).loadRecipes).not.toHaveBeenCalled();
    });

    it('goToPage should not call loadRecipes if page is invalid (>= totalPages)', () => {
      spyOn(component as any, 'loadRecipes');
      component.goToPage(2); // totalPages is 2, so page 2 is out of bounds
      expect(component.currentPage).toBe(0); // Should not change
      expect((component as any).loadRecipes).not.toHaveBeenCalled();
    });

    it('nextPage should increment currentPage and call loadRecipes if not on last page', () => {
      component.currentPage = 0;
      component.totalPages = 2;
      spyOn(component as any, 'loadRecipes'); // Don't call through, just spy
      component.nextPage();
      expect(component.currentPage).toBe(1);
      expect((component as any).loadRecipes).toHaveBeenCalledTimes(1);
    });

    it('nextPage should not do anything if on the last page', () => {
      component.currentPage = 1;
      component.totalPages = 2; // Last page is 1 (0-indexed)
      spyOn(component as any, 'loadRecipes');
      component.nextPage();
      expect(component.currentPage).toBe(1); // Stays on current page
      expect((component as any).loadRecipes).not.toHaveBeenCalled();
    });

    it('previousPage should decrement currentPage and call loadRecipes if not on first page', () => {
      component.currentPage = 1;
      component.totalPages = 2;
      spyOn(component as any, 'loadRecipes'); // Don't call through, just spy
      component.previousPage();
      expect(component.currentPage).toBe(0);
      expect((component as any).loadRecipes).toHaveBeenCalledTimes(1);
    });

    it('previousPage should not do anything if on the first page', () => {
      component.currentPage = 0;
      component.totalPages = 2;
      spyOn(component as any, 'loadRecipes');
      component.previousPage();
      expect(component.currentPage).toBe(0); // Stays on current page
      expect((component as any).loadRecipes).not.toHaveBeenCalled();
    });
  });

  it('getPages should return an array of page numbers from 0 to totalPages-1', () => {
    component.totalPages = 3;
    expect(component.getPages()).toEqual([0, 1, 2]);
    component.totalPages = 0;
    expect(component.getPages()).toEqual([]);
    component.totalPages = 1;
    expect(component.getPages()).toEqual([0]);
  });

  it('ngOnDestroy should unsubscribe from routerSubscription', () => {
    fixture.detectChanges(); // to initialize routerSubscription
    spyOn(component['routerSubscription'] as Subscription, 'unsubscribe');
    component.ngOnDestroy();
    expect(component['routerSubscription'].unsubscribe).toHaveBeenCalled();
  });

});
