import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ToastService } from 'src/app/toast.service';

@Component({
  selector: 'app-voucher',
  templateUrl: './voucher.component.html',
  styleUrls: ['./voucher.component.css',
    '../../../assets/my-ui/css/voucher.css'
  ]
})
export class VoucherComponent {
  vouchers: any;
  user: any;

  currentDate = new Date();

  constructor(private http: HttpClient, private toasmsg: ToastService) { }
  ngOnInit(): void {
    this.getdata();
  }

  getdata() {
    this.http.get("http://localhost:8000/user/voucher/data").subscribe((response: any) => {
      this.vouchers = response
      console.log(this.vouchers);
    }, (error) => {
      console.log(error);
    })
  }

  checkdate(ngaybd:any,ngaykt:any):boolean{
    let isChecked = false
    let ngaybatdau = new Date(ngaybd);
    let ngayketthuc = new Date(ngaykt)
    if(this.currentDate >= ngaybatdau && this.currentDate <= ngayketthuc){
      isChecked = true
    }
    return isChecked;
  }

  addvoucher(id:any) {
    const getdatauser = localStorage.getItem("customer")
    const customer = getdatauser ? JSON.parse(getdatauser) : [];

    if (!getdatauser) {
      this.toasmsg.showToast({
        title: "Bạn chưa đăng nhập",
        message: "Bạn cần phải đăng nhập để lưu voucher",
        type: "warning",
        duration: 3000
      })
    }
    else {
      let params = {
        MaKhachHang:customer.MaKhachHang,
        MaPhieu: id,
        SoLuong: 1
      }

      this.http.post("http://localhost:8000/user/voucher/create",params).subscribe((response: any) => {
        console.log(response);
        if(response.result){
          this.toasmsg.showToast({
            title:"Lấy thành công",
            message:"Đã lưu thông tin giảm giá",
            type:"success",
            duration:3000
          })
          this.getdata()
        }else{
          this.toasmsg.showToast({
            title:"Có lỗi",
            message:"Có lỗi xảy ra vui lòng thử lại sau",
            type:"error",
            duration:3000
          })
        }
      }, (error) => {
        console.log(error);
      })
    }
  }
}
