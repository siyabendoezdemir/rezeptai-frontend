import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeSectionComponent } from './recipe-section.component';

describe('RecipeSectionComponent', () => {
  let component: RecipeSectionComponent;
  let fixture: ComponentFixture<RecipeSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecipeSectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecipeSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
