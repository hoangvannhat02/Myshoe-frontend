import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { InfouserComponent } from './infouser.component';
import { RouterModule, Routes } from '@angular/router';
import { HeaderComponent } from '../layout/header/header.component';
import { FooterComponent } from '../layout/footer/footer.component';
import { HeaderModule } from '../layout/header/header.module';
import { FooterModule } from '../layout/footer/footer.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FilterPipe } from 'src/app/help/filterPipe';
import { PaginationComponent } from 'src/app/help/pagination/pagination.component';
import { PaginationModule } from 'src/app/help/pagination/pagination.module';

const router:Routes = [
  {
    path:"",
    component:InfouserComponent
  }
]

@NgModule({
  declarations: [InfouserComponent,
    FilterPipe,
  ],
  imports: [
    HeaderModule,FooterModule
    ,PaginationModule,
    CommonModule,FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(router)
  ],
  providers:[DatePipe]
})
export class InfouserModule { }
