import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { LoginComponent } from './login.component';
import { RouterModule, Routes } from '@angular/router';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderModule } from '../layout/header/header.module';
import { FooterModule } from '../layout/footer/footer.module';


import {
  GoogleSigninButtonModule 
} from '@abacritt/angularx-social-login';

const router:Routes = [
  {
    path:'',component:LoginComponent
  }
]

@NgModule({
  declarations: [LoginComponent
  ],
  imports: [
    CommonModule,
    HeaderModule,
    FooterModule,
    GoogleSigninButtonModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule.forChild(router),
  ],
  
})
export class LoginModule { }
