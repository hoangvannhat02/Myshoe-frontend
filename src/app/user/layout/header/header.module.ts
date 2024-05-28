import { NgModule, Pipe } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { HeaderComponent } from './header.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';

const router:Routes = [
  {
    path:'',
    component:HeaderComponent
  }
]

@NgModule({
  declarations: [HeaderComponent],
  imports: [
    FormsModule,
    CommonModule,
    RouterModule,
    NgxSpinnerModule,
  ],
  providers:[DatePipe
  ],
  exports:[HeaderComponent]
})
export class HeaderModule { }
