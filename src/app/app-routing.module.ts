import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './user/layout/layout/layout.component';

const routes: Routes = [
  {
    path:'',redirectTo:'home',pathMatch:'full'
  },
  {
    path:'home',loadChildren:()=>import('./user/home/home.module').then(m=>m.HomeModule),
  },
  {
    path:'login',loadChildren:()=>import('./user/login/login.module').then(m=>m.LoginModule),
  },
  {
    path:'cart',loadChildren:()=>import('./user/cart/cart.module').then(m=>m.CartModule),
  },
  {
    path:'category',loadChildren:()=>import('./user/category/category.module').then(m=>m.CategoryModule),
  },
  {
    path:'checkout',loadChildren:()=>import('./user/checkout/checkout.module').then(m=>m.CheckoutModule),
  },
  {
    path:'detail',loadChildren:()=>import('./user/detail/detail.module').then(m=>m.DetailModule),
  },
  {
    path:'infouser',loadChildren:()=>import('./user/infouser/infouser.module').then(m=>m.InfouserModule),
  },
  {
    path:'voucher',loadChildren:()=>import('./user/voucher/voucher.module').then(m=>m.VoucherModule),
  },
  {
    path:'phoneotp',loadChildren:()=>import('./user/phoneotp/phoneotp.module').then(m=>m.PhoneotpModule),
  },
  {
    path:'forgetpassword',loadChildren:()=>import('./user/forgetpassword/forgetpassword.module').then(m=>m.ForgetpasswordModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
