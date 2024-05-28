import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { HeaderModule } from '../layout/header/header.module';
import { FooterModule } from '../layout/footer/footer.module';
import { PaginationModule } from 'src/app/help/pagination/pagination.module';
import {
  register as registerSwiperElements
} from 'swiper/element/bundle'

registerSwiperElements()

const routes:Routes = [
  {
    path:'',component:HomeComponent
  }
]

@NgModule({
  declarations:[
    HomeComponent,
  ],
  imports: [
    HeaderModule,FooterModule,
    PaginationModule,
    CommonModule,
    RouterModule.forChild(routes)
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
  providers:[DatePipe]
})
export class HomeModule { }
