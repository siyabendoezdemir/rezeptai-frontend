import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
// AdminComponent is standalone, so it's not declared here.
// It's imported by AdminRoutingModule if it's a child route's component, 
// or if AdminComponent itself needs to import AdminRoutingModule (which is not typical).

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AdminRoutingModule
    // AdminComponent, // if it were not standalone and declared here or if it were imported to be used by this module's components
  ]
})
export class AdminModule { } 