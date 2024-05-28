import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { VoucherComponent } from './voucher.component';
import { RouterModule, Routes } from '@angular/router';
import { HeaderModule } from '../layout/header/header.module';
import { FooterModule } from '../layout/footer/footer.module';

const routes:Routes = [
  {
    path:"",
    component:VoucherComponent
  }
]

@NgModule({
  declarations: [VoucherComponent,
  ],
  imports: [
    CommonModule,
    HeaderModule,
    FooterModule,
    RouterModule.forChild(routes),
  ],
  providers:[DatePipe]
})
export class VoucherModule { }
