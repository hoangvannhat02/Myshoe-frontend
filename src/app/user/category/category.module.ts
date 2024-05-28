import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryComponent } from './category.component';
import { RouterModule, Routes } from '@angular/router';
import { HeaderModule } from '../layout/header/header.module';
import { FooterModule } from '../layout/footer/footer.module';
import { FormsModule } from '@angular/forms';
import { FilterService } from 'src/app/my-service/filter.service';
import { PaginationModule } from 'src/app/help/pagination/pagination.module';

const routes:Routes = [
  {
    path:':id',component:CategoryComponent,
  },
  {
    path:'',component:CategoryComponent,
  },
  {
    path:'search',component:CategoryComponent,
  }
]

@NgModule({
  declarations: [CategoryComponent
  ],
  imports: [
    FormsModule,
    HeaderModule,
    FooterModule,
    PaginationModule,
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class CategoryModule { }
