import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { HttpClient } from '@angular/common/http';
import { Component, Injectable, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CartserviceService } from 'src/app/my-service/cartservice.service';
import { CustomerService } from 'src/app/my-service/customer.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'
  ]
})
@Injectable({
  providedIn: 'root'
})
export class HeaderComponent {
  cartCount: number = 0;
  customer = {
    MaKhachHang: 0,
    HoVaTen: "",
    Anh: "",
    DiaChi: "",
    SoDienThoai: "",
    Email: "",
    PassWord: ""
  }

  searching = true

  products: any[] = []
  searchcontent: string = ""
  datasearch: any[] = []

  datahistory: any[] = []

  orther:any = {}

  imguser: any

  isExit = false;
  sum: number = 0;
  carts: any[] = [];
  constructor(private router: Router, private cart: CartserviceService,
    private spinner: NgxSpinnerService,
    private http: HttpClient,
    private customerService: CustomerService,
    private authService: SocialAuthService) {

    const data = JSON.parse(localStorage.getItem("datahistory")!) || []
    if (data) {
      this.datahistory = data
    }
  }
  ngOnInit(): void {
    this.loadcart();
    this.getcustomer();
    this.getdata()
    this.getDataOrther()
  }

  getDataOrther(){
    this.http.get("http://localhost:8000/admin/orther/getdata").subscribe((response) => {
      if (response) {
        this.orther = response
        console.log(this.orther);
        
      }
    }, (error) => {
      console.error(error);
    }
    )
  }
  
  getcustomer() {
    const data = localStorage.getItem("customer");
    const datas = data ? JSON.parse(data) : [];
    if (data) {
      this.isExit = true
      this.http.get("http://localhost:8000/user/customer/databyid/" + datas.MaKhachHang).subscribe((response: any) => {
        if (response) {
          console.log(response);

          this.customer.MaKhachHang = response[0].MaKhachHang
          this.customer.HoVaTen = response[0].HoVaTen
          this.customer.DiaChi = response[0].DiaChi ?? null
          this.customer.SoDienThoai = response[0].SoDienThoai ?? null
          this.customer.Email = response[0].Email
          this.customer.Anh = response[0].Anh
          this.customer.PassWord = response[0].PassWord ?? null

          if (this.customer.Anh.startsWith("https://") || this.customer.Anh.startsWith("http://")) {
            this.imguser = this.customer.Anh
          } else if (this.customer.Anh == "") {
            this.imguser = "./assets/my-ui/image/user7.jpg"
          }
          else {
            this.imguser = "http://localhost:8000/" + this.customer.Anh
          }
        }

      }, (error) => {
        console.error(error);
      })

    }
  }

  getdata() {
    this.http.get("http://localhost:8000/user/product/data").subscribe((response: any) => {
      if (response) {
        this.products = response;

      }
    }, (error) => {
      console.error(error);
    })
  }

  searchdata(event: any) {
    this.searchcontent = event.target.value
    const convertToLowerCase = this.searchcontent.toLowerCase()
    this.searching = false
    const datasearch = this.products
      .filter(item =>
        item.TenSanPham.toLowerCase().includes(convertToLowerCase) ||
        item.TenHang.toLowerCase().includes(convertToLowerCase)
      )
      .map(item => ({
        suggestion: item.TenSanPham.toLowerCase().includes(convertToLowerCase)
          ? item.TenSanPham
          : item.TenHang
      }));
    this.datasearch = datasearch
  }

  search() {
    const ischeck = this.datahistory.filter(x=>x === this.searchcontent)
    if(ischeck.length==0){
      this.datahistory.push(this.searchcontent)
      localStorage.setItem("datahistory",JSON.stringify(this.datahistory))
    }
    const queryParams: NavigationExtras = {
      queryParams: { query: this.searchcontent },
      replaceUrl: true
    };
    this.router.navigate(['category/search'], queryParams);
    this.searchcontent = ""
  }

  optionsearh(content: any) {
    this.searchcontent = content.toString()
    const ischeck = this.datahistory.filter(x=>x === content)
    if(ischeck.length==0){
      this.datahistory.push(this.searchcontent)
      localStorage.setItem("datahistory",JSON.stringify(this.datahistory))
    }
    const queryParams: NavigationExtras = {
      queryParams: { query: this.searchcontent },
      replaceUrl: true
    };
    this.router.navigate(['category/search'], queryParams);    
    this.searchcontent = ""
  }

  deletehistory(index: number) {
    console.log(index);
    this.datahistory.splice(index,1)
    localStorage.setItem("datahistory",JSON.stringify(this.datahistory))
    this.datahistory = JSON.parse(localStorage.getItem("datahistory")!) || []
  }

  loadcart() {
    this.customerService.customerData$.subscribe((customer) => {
      if (customer) {
        this.cart.cartData$.subscribe((data) => {
          if (data) {
            this.cartCount = data;
          } else {
            this.cartCount = 0;
          }
        });
      }
    });
  }

  logout(event: Event) {
    event.preventDefault()
    this.authService.signOut()
    this.customerService.clearCustomer()
    this.router.navigateByUrl('/login');
  }
  redirectToInfo() {
    const componentState = {
      isInfo: true,
      isInfoBill: false,
      isPassword: false,
      isVoucher: false
    };
    sessionStorage.setItem('componentState', JSON.stringify(componentState));
    this.router.navigate(['/infouser']);
  }
}
