import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { CheckoutComponent } from './checkout.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppModule } from 'src/app/app.module';
import { NgxPayPalModule } from 'ngx-paypal';

const routes:Routes = [
  {
    path:"",
    component:CheckoutComponent
  }
]

@NgModule({
  declarations: [CheckoutComponent],
  imports: [
    CommonModule,
    FormsModule,
    NgxPayPalModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  providers:[DatePipe]
})
export class CheckoutModule { }
