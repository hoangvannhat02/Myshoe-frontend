import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { LayoutComponent } from './layout/layout.component';
import { RouterModule, Routes } from '@angular/router';

const roter:Routes = [
  {
    path:"",
    component:LayoutComponent
  }
]

@NgModule({
  declarations: 
  [
    LayoutComponent,
  ],
  imports: [
    RouterModule,
    CommonModule,
  ]
})
export class LayoutModule { }
