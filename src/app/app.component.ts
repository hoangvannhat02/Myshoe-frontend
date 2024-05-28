import { Component } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'myshoes';
 
  constructor(
    private router:Router,
    private spinner:NgxSpinnerService
  ) {
    const connection = (window.navigator as any).connection;
    const connectionSpeed = connection ? connection.downlink : 1; // Default to 1 Mbps if connection information is not available
    const loadTime = connectionSpeed < 2 ? 3000 : 1000;
    router.events.subscribe((event)=>{
      if(event instanceof NavigationStart){
        spinner.show()
      }else if(event instanceof NavigationEnd){
        setTimeout(()=>{
          spinner.hide()
        },1000)
      }else if(event instanceof NavigationCancel){
        setTimeout(()=>{
          spinner.hide()
        },1000)
      }else if(event instanceof NavigationError){
        setTimeout(()=>{
          spinner.hide()
        },1000)
      }
    })
  }

  ngAfterViewInit() {
    
  }

  

}
