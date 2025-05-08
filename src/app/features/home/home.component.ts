import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchInputComponent } from '../../shared/components/search-input/search-input.component';
import { RecipeSectionComponent } from '../recipe-section/recipe-section.component';
import { HeaderComponent } from '../../core/components/header/header.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    SearchInputComponent,
    RecipeSectionComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
