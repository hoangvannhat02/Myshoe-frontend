import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './footer.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TimeAgoPipe } from 'src/app/my-service/time-ago.pipe';


const router:Routes = [
 {
  path:'',
  component:FooterComponent
 }
]

@NgModule({
  declarations: [FooterComponent,TimeAgoPipe],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule
  ],
  exports:[FooterComponent]
})
export class FooterModule { }
