import { NgModule, Pipe } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { CartComponent } from './cart.component';
import {  RouterModule, Routes } from '@angular/router';
import { HeaderComponent } from '../layout/header/header.component';
import { FooterComponent } from '../layout/footer/footer.component';
import { HeaderModule } from '../layout/header/header.module';
import { FooterModule } from '../layout/footer/footer.module';
import { FormsModule } from '@angular/forms';

const routes:Routes = [
  {
    path:'',component:CartComponent
  }
]

@NgModule({
  declarations: [
    CartComponent,
  ],
  imports: [
    FormsModule,
    HeaderModule,
    FooterModule,
    CommonModule,
    RouterModule.forChild(routes)
  ],
  providers:[DatePipe]
})
export class CartModule { }
