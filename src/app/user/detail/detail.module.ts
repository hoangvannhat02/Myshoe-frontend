import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { DetailComponent } from './detail.component';
import {  RouterModule, Routes } from '@angular/router';
import { HeaderModule } from '../layout/header/header.module';
import { FooterModule } from '../layout/footer/footer.module';
import { FormsModule } from '@angular/forms';

const router:Routes = [
  {
    path:":id",
    component:DetailComponent
  }
]

@NgModule({
  declarations: [DetailComponent
  ],
  imports: [
    HeaderModule,
    FooterModule,
    FormsModule,
    CommonModule,
    RouterModule.forChild(router)
  ],
  providers:[DatePipe]
})
export class DetailModule { }
