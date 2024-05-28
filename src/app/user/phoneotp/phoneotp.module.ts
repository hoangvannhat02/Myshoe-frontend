import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgOtpInputModule } from 'ng-otp-input';
import { RouterModule, Routes } from '@angular/router';
import { PhoneotpComponent } from './phoneotp.component';
const router:Routes = [
  {
    path:'',
    component:PhoneotpComponent
  }
]

@NgModule({
  declarations: [PhoneotpComponent],
  imports: [
    CommonModule,
    NgOtpInputModule,
    RouterModule.forChild(router)
  ]
})
export class PhoneotpModule { }
