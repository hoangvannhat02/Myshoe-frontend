import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ICreateOrderRequest, IPayPalConfig, ITransactionItem } from 'ngx-paypal';
import { config } from 'rxjs';
import { carts } from 'src/app/model/cart';
import { CartserviceService } from 'src/app/my-service/cartservice.service';
import { ToastService } from 'src/app/toast.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'
  ]
})
export class CheckoutComponent {
  public payPalConfig?: IPayPalConfig;

  discountPrice: number = 0

  combinedInfo?: ITransactionItem[]
  sum = 0;
  totalPrice = 0;
  currentDate = new Date();
  transportPrice = 0;
  billnew: any;
  formCheckout: FormGroup
  transportName = ""
  infoBill = {
    NguoiNhan: "",
    DienThoai: "",
    TongTien: 0,
    HinhThucThanhToan: "",
    MaPhieu: null,
    TenPhieu:"",
    TenVanChuyen:"",
    MaVanChuyen: null,
    TrangThai: 0,
    NgayTao: "",
    DiaChiNhan: "",
    MaKhachHang: null,
    trangthaithanhtoan: 0,
    GiaVanChuyen:0
  }
  submitted = false
  isShow = true;
  vouchername = "";
  carts: carts[] = []
  transports: any;
  vouchers: any;
  paymentCode: any;
  constructor(
    private toasmsg: ToastService,
    private cart: CartserviceService,
    private route: ActivatedRoute,
    private http: HttpClient,
    private datePiPe: DatePipe,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.formCheckout = this.fb.group({
      fullname: ['', [Validators.required, Validators.minLength(1)]],
      address: ['', [Validators.required, Validators.minLength(1)]],
      phonenumbers: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(10),Validators.pattern('^[0-9]*$')]],
      transport: ['', [Validators.required]]
    });
    
  }

  ngOnInit(): void {

    this.route.queryParams.subscribe(params => {
      this.paymentCode = params['code'];
      if (this.paymentCode == "00") {
        const infoBill = window.sessionStorage.getItem('infoPayment');
        const bill = infoBill ? JSON.parse(infoBill) : null;

        this.infoBill.NguoiNhan = bill.NguoiNhan
        this.infoBill.DienThoai = bill.DienThoai
        this.infoBill.HinhThucThanhToan = bill.HinhThucThanhToan
        this.infoBill.MaPhieu = bill.MaPhieu
        this.infoBill.MaVanChuyen = bill.MaVanChuyen
        this.infoBill.DiaChiNhan = bill.DiaChiNhan
        this.infoBill.TongTien = bill.TongTien
        this.infoBill.trangthaithanhtoan = 1
        this.infoBill.TenPhieu = bill.TenPhieu
        this.infoBill.TenVanChuyen = bill.TenVanChuyen
        this.payment()
        window.sessionStorage.clear();
      } else {
        // this.toasmsg.showToast({
        //   title: "Thanh toán thất bại",
        //   type: "warning",
        //   duration: 10000
        // })
        // window.sessionStorage.clear();
      }
    });

    //khoi tao thanh toan paypal
    // this.initConfig()

    this.getcart()
    this.getvoucher()
    this.gettransport()

    this.combinedInfo = this.carts.map((val) => {
      return {
        name: val.ProductName,
        quantity: val.Quantity.toString(),
        unit_amount: {
          currency_code: 'USD',
          value: Math.floor(val.ProductPrice / 25.000).toFixed(2).toString(),
        }
      }
    })
    // this.combinedInfo[0].unit_amount.value + (this.transportPrice/23000).toFixed(2) + (this.discountPrice/23000).toFixed(2);
    // console.log(this.combinedInfo);

    // this.combinedInfo = rscarts.map(product => JSON.stringify(product)).join(',');
    // console.log(combinedInfo);

  }

  checkdate(ngaybd: any, ngaykt: any): boolean {
    let isChecked = false
    let ngaybatdau = new Date(ngaybd);
    let ngayketthuc = new Date(ngaykt)
    if (this.currentDate.getTime() >= ngaybatdau.getTime() && this.currentDate.getTime() <= ngayketthuc.getTime()) {
      isChecked = true
    }
    return isChecked;
  }

  checkmoney(tientoithieu: any, tientoida: any): boolean {
    let ischeck = false
    if (this.sum >= tientoithieu && this.sum <= tientoida) {
      ischeck = true
    }
    return ischeck
  }

  getcart() {
    this.carts = JSON.parse(localStorage.getItem("cartItemsCheckout")!) || [];
    this.sum = this.carts.reduce((sum, value) => sum + (value.Quantity * value.ProductPrice), 0)
    this.totalPrice += this.sum
  }

  getvoucher() {
    let data = localStorage.getItem("customer")
    let customer = data ? JSON.parse(data) : [];

    this.http.get("http://localhost:8000/user/voucher/getdatabycustomerid/" + customer.MaKhachHang).subscribe((response: any) => {
      if (response) {
        this.vouchers = response;
        console.log(this.vouchers);
      }
    }, (error) => {
      console.error(error);
    })
  }

  gettransport() {
    this.http.get("http://localhost:8000/user/voucher/datatransport").subscribe((response: any) => {
      if (response) {
        this.transports = response;
      }
    }, (error) => {
      console.error(error);
    })
  }

  getnewdata() {
    this.http.get("http://localhost:8000/user/billofsale/datanew").subscribe((response: any) => {
      this.billnew = response
      console.log(this.billnew);

    }, (error) => {
      console.error(error);
    })
  }

  changetransport(item: any) {
    this.transportPrice = item.Gia
    this.transportName = item.TenVanChuyen
    this.infoBill.TenVanChuyen = item.TenVanChuyen
    this.infoBill.MaVanChuyen = item.MaVanChuyen
    this.infoBill.GiaVanChuyen = item.Gia
  }

  addvoucher(item: any) {
    this.vouchername = item.TenPhieu
    this.infoBill.MaPhieu = item.MaPhieu
    this.infoBill.TenPhieu = item.TenPhieu
    switch (item.LoaiPhieu) {
      case "Phần trăm":
        this.sum = this.carts.reduce((sum, value) => sum + (value.Quantity * value.ProductPrice), 0)
        // this.sum = this.sum * (item.GiaTri / 100);
        this.discountPrice = this.sum * (item.GiaTri / 100);
        break

      case "VND":
        this.sum = this.carts.reduce((sum, value) => sum + (value.Quantity * value.ProductPrice), 0)
        this.discountPrice = this.sum - item.GiaTri
        // this.sum -= item.GiaTri;
        break
      default:
        this.sum = this.carts.reduce((sum, value) => sum + (value.Quantity * value.ProductPrice), 0)
    }
    this.isShow = true
  }

  removevoucher() {
    this.vouchername = ""
    this.infoBill.MaPhieu = null
    this.sum = this.carts.reduce((sum, value) => sum + (value.Quantity * value.ProductPrice), 0)
  }
  statusPaypal = false
  statusPay = true
  submitPayment() {
    this.infoBill.TongTien = this.sum + this.transportPrice - this.discountPrice
    this.submitted = true
    if (this.formCheckout.valid) {
      if (this.infoBill.HinhThucThanhToan == "Thanh toán VnPay") {
        window.sessionStorage.setItem('infoPayment', JSON.stringify(this.infoBill));
        this.http.post("http://localhost:8000/order/create_payment_url", {
          amount: this.infoBill.TongTien,
          language: 'vn'
        }).subscribe((res: any) => {
          window.location.href = res
        })
      } else if (this.infoBill.HinhThucThanhToan === "Thanh toán PayPal") {
        // console.log(((this.sum) / 23000).toFixed(2))
        // console.log((this.transportPrice / 23000).toFixed(2))
        this.initConfig()

        this.statusPaypal = true
        this.statusPay = false
      } else {
        this.infoBill.HinhThucThanhToan = "Thanh toán khi giao hàng"
        this.payment()
      }
    }
  }

  payment() {
    const formattedDate = this.datePiPe.transform(new Date(Date.now()), 'yyyy-MM-dd');
    if (formattedDate !== null) {
      this.infoBill.NgayTao = formattedDate;
    }
    let data = localStorage.getItem("customer")
    let customer = data ? JSON.parse(data) : [];

    this.infoBill.MaKhachHang = customer.MaKhachHang

    this.http.post("http://localhost:8000/user/billofsale/create", this.infoBill).subscribe((response: any) => {

      if (response.result) {
        this.http.get("http://localhost:8000/user/billofsale/datanew").subscribe((response: any) => {
          this.billnew = response

          this.carts.forEach((value) => {
            let params = {
              MaChiTietSanPham: value.ProductID,
              MaHoaDon: this.billnew[0].MaHoaDon,
              SoLuong: value.Quantity,
              GiaBan: value.ProductPrice,
              TongTien: (value.Quantity * value.ProductPrice)
            }
            this.http.post("http://localhost:8000/user/detailbillofsale/create", params)
              .subscribe((response: any) => {

              }, (error) => {
                console.error(error);
              })
          })

          this.sendMail(customer.Email, this.infoBill, this.carts)
            this.carts.map((item) => {
              this.cart.removeFromCart(item.ProductID, item.UserID)
            })
            localStorage.removeItem("cartItemsCheckout")
            this.getcart();
            this.toasmsg.showToast({
              title: 'Thanh toán thành công',
              message: "Đợi chuyển trang",
              type: 'success',
              duration: 5000
            })
            setTimeout(() => {
              this.router.navigate(['/infouser'], { queryParams: { code: '01' } })
            }, 5000);
        }, (error) => {
          console.error(error);
        })

      }
      else {
        this.toasmsg.showToast({
          title: "Thanh toán thất bại",
          message: "Có lỗi xảy ra vui lòng thử lại",
          type: "error"
        })
      }

    }, (error) => {
      console.error(error);
    })
  }

  paymentvnpay(event: any) {
    const getFocusElementPay = event.target.closest('.box-pay').querySelector('.pay_method').textContent;
    this.infoBill.HinhThucThanhToan = getFocusElementPay;
    console.log(this.infoBill.HinhThucThanhToan);
    if (this.infoBill.HinhThucThanhToan !== "Thanh toán PayPal") {
      this.statusPaypal = false
      this.statusPay = true
    }

  }
  // thanh toan paypal
  private initConfig(): void {

    this.payPalConfig = {
      currency: 'USD',
      clientId: environment.payment.PayPalClientId,
      createOrderOnClient: (data) => <ICreateOrderRequest>{
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: 'USD',
            value: Math.floor((this.sum + this.transportPrice - this.discountPrice) / 25.000).toFixed(2),
            breakdown: {
              item_total: {
                currency_code: 'USD',
                value: Math.floor(this.sum / 25.000).toFixed(2)
              },
              shipping: {
                currency_code: 'USD',
                value: Math.floor(this.transportPrice / 25.000).toFixed(2)
              },
              discount: {
                currency_code: 'USD',
                value: Math.floor(this.discountPrice / 25.000).toFixed(2)
              }
            }
          },
          items: this.combinedInfo
        }]
      },
      advanced: {
        commit: 'true'
      },
      style: {
        label: 'paypal',
        layout: 'vertical'
      },
      onApprove: (data, actions) => {
        console.log('onApprove - transaction was approved, but not authorized', data, actions);
        actions.order.get().then((details: any) => {
          console.log('onApprove - you can get full order details inside onApprove: ', details);
        });
      },
      onClientAuthorization: (data) => {
        if (data.status === "COMPLETED") {
          this.infoBill.trangthaithanhtoan = 1
          this.payment()
        } else {
          this.toasmsg.showToast({
            title: "Thanh toán thất bại",
            message: "Có lỗi xảy ra vui lòng thử lại",
            type: "error",
            duration: 5000
          })
        }
        console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
        // this.showSuccess = true;
      },
      onCancel: (data, actions) => {
        console.log('OnCancel', data, actions);
        // this.showCancel = true;

      },
      onError: err => {
        console.log('OnError', err);
        // this.showError = true;
      },
      onClick: (data, actions) => {
        console.log('onClick', data, actions);
        // this.resetStatus();
      }
    };
  }

  sendMail(email: string, bill: any, product: any) {
    this.http.post("http://localhost:8000/user/customer/sendemail", { email: email, bill: bill, products: product }).subscribe((response: any) => {
      console.log(response);
    }, (error) => {
      console.error(error);
    })
  }

  hiddenModal() {
    this.isShow = true
  }

  showModal() {
    this.isShow = false
  }

  backtocart() {
    localStorage.removeItem("cartItemsCheckout")
    this.router.navigate(["/cart"])
  }
}