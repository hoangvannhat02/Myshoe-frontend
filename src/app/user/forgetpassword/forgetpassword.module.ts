import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ForgetpasswordComponent } from './forgetpassword.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

const router:Routes = [
  {
    path:'',
    component:ForgetpasswordComponent
  }
]

@NgModule({
  declarations: [ForgetpasswordComponent],
  imports: [
    FormsModule,
    CommonModule,
    HttpClientModule,
    RouterModule.forChild(router),
  ]
})
export class ForgetpasswordModule { }
