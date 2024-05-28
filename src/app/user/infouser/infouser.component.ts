import { HttpClient } from '@angular/common/http';
import { Parser } from '@angular/compiler';
import { Component, ElementRef, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from 'src/app/toast.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import  auth  from 'firebase/compat/app';

import * as bcrypt from 'bcryptjs';
import { AuthService } from 'src/app/my-service/auth.service';

// Custom validator function
const passwordMatchValidator: ValidatorFn = (control: AbstractControl): { [key: string]: boolean } | null => {
  const newpass = control.get('newpass');
  const reinputnewpass = control.get('reinputnewpass');

  // Kiểm tra xem newpass và reinputnewpass có bằng nhau không
  if (newpass && reinputnewpass && newpass.value !== reinputnewpass.value) {
    // Trả về object nếu không khớp
    return { 'passwordMismatch': true };
  }
  // Trả về null nếu khớp
  return null;
};

// Custom validator function
const passwordMatchValidator2: ValidatorFn = (control: AbstractControl): { [key: string]: boolean } | null => {
  const newpass = control.get('newpass2');
  const reinputnewpass = control.get('reinputnewpass2');

  // Kiểm tra xem newpass và reinputnewpass có bằng nhau không
  if (newpass && reinputnewpass && newpass.value !== reinputnewpass.value) {
    // Trả về object nếu không khớp
    return { 'passwordMismatch2': true };
  }
  // Trả về null nếu khớp
  return null;
};

@Component({
  selector: 'app-infouser',
  templateUrl: './infouser.component.html',
  styleUrls: ['./infouser.component.css',
    '../../../assets/my-ui/css/voucher.css'
  ]
})
export class InfouserComponent {
  @ViewChild('fileinput') fileInput!: ElementRef;

  currentPage: number = 1;
  itemsPerPage: number = 3;

  isInfo = false
  isInfoBill = false
  isVoucher = false
  imageSrc: any = ""
  selectedFile: any = "";
  isPassword = false
  notExistPassWord = false
  customer = {
    MaKhachHang: 0,
    HoVaTen: "",
    Anh: "",
    DiaChi: "",
    SoDienThoai: "",
    Email: "",
    PassWord: "",
    XacThucEmail:0
  }

  datacustomerbyidlogin: any

  statusDefault: string = "0"

  productinbills: any[] = []
  vouchers: any
  imageEditSrc: any = "";
  currentImg: any = ""

  databillsbypagination: any = []
  bills: any = []

  formPassword: FormGroup
  formNewPassword: FormGroup
  submitted = false;
  submitted2 = false;
  paymentCode: any

  users: any

  currentDate = new Date();

  constructor(
    private http: HttpClient,
    private toastmsg: ToastService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.formPassword = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(3)]],
      newpass: ['', [Validators.required, Validators.minLength(3)]],
      reinputnewpass: ['', [Validators.required, Validators.minLength(3)]]
    }, {
      validator: passwordMatchValidator
    });

    this.formNewPassword = this.fb.group({
      newpass2: ['', [Validators.required, Validators.minLength(3)]],
      reinputnewpass2: ['', [Validators.required, Validators.minLength(3)]]
    }, {
      validator: passwordMatchValidator2
    });

    const data = localStorage.getItem("customer");
    const datas = data ? JSON.parse(data) : [];
    if (data) {
      this.users = datas
    }
  }
  ngOnInit(): void {
    this.getcustomer();
    this.getVouchers();
    this.getBillofsales(parseInt(this.statusDefault));
    this.getcustomerbyidlogin()

    const storedState = sessionStorage.getItem('componentState');
    if (storedState) {
      const parsedState = JSON.parse(storedState);
      this.isInfo = parsedState.isInfo;
      this.isInfoBill = parsedState.isInfoBill;
      this.isPassword = parsedState.isPassword;
      this.isVoucher = parsedState.isVoucher;
    } else {
      this.isInfo = true;
    }

    this.route.queryParams.subscribe(params => {
      this.paymentCode = params['code'];
      const status = params['status']
      if (this.paymentCode === "01") {
        this.isInfoBill = true;
        this.isInfo = false;
      }
      else if ((status) && (status === "1" || status === "0" || status === "2" || status === "3")) {
        this.statusDefault = status
        this.getBillofsales(parseInt(status))
      }
    });
  }

  replayPassWord() {
    if (this.datacustomerbyidlogin.PassWord.length === 0) {
      this.submitted2 = true;
      if (this.formNewPassword.valid) {
        const newPasswordValue = this.formNewPassword.get('newpass2')!.value;
        let newcpass = {
          MaKhachHang: "",
          HoVaTen: "",
          DiaChi: "",
          SoDienThoai: "",
          Email: "",
          Anh: "",
          PassWord: this.hashPassword(newPasswordValue),
        }
        this.http.get("http://localhost:8000/user/customer/databyid/" + this.users.MaKhachHang).subscribe((response: any) => {
          if (response) {
            newcpass.MaKhachHang = response[0].MaKhachHang
            newcpass.HoVaTen = response[0].HoVaTen
            newcpass.DiaChi = response[0].DiaChi
            newcpass.SoDienThoai = response[0].SoDienThoai
            newcpass.Email = response[0].Email
            newcpass.Anh = response[0].Anh
            this.http.post("http://localhost:8000/user/customer/update", newcpass).subscribe((response: any) => {
              this.toastmsg.showToast({
                title: "Thêm mật khẩu thành công",
                type: "success"
              })
            }, (error) => {
              console.error(error);
            })
          }
        }, (error) => {
          console.error(error);
        })
      } 
    } else {
      this.submitted = true;
      if (this.formPassword.valid) {
        const passwordValue = this.formPassword.get('password')!.value;
        const newPasswordValue = this.formPassword.get('newpass')!.value;
        let params = {
          Email: this.users.Email,
          PassWord: passwordValue
        }
        this.http.post("http://localhost:8000/user/customer/login", params).subscribe((response: any) => {
          if (response.result.length > 0) {
            this.notExistPassWord = false
            let newcpass = {
              MaKhachHang: "",
              HoVaTen: "",
              DiaChi: "",
              SoDienThoai: "",
              Email: "",
              Anh: "",
              PassWord: this.hashPassword(newPasswordValue),
            }
            this.http.get("http://localhost:8000/user/customer/databyid/" + this.users.MaKhachHang).subscribe((response: any) => {
              if (response) {
                newcpass.MaKhachHang = response[0].MaKhachHang
                newcpass.HoVaTen = response[0].HoVaTen
                newcpass.DiaChi = response[0].DiaChi
                newcpass.SoDienThoai = response[0].SoDienThoai
                newcpass.Email = response[0].Email
                newcpass.Anh = response[0].Anh

                this.http.post("http://localhost:8000/user/customer/update", newcpass).subscribe((response: any) => {
                  this.toastmsg.showToast({
                    title: "Đổi mật khẩu thành công",
                    type: "success"
                  })
                }, (error) => {
                  console.error(error);
                })
              }
            }, (error) => {
              console.error(error);
            })

          }
          else {
            this.notExistPassWord = true
          }
        }, (error) => {
          console.error(error);
        })
      } 
    }
  }

  hashPassword(password: string): string {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  }

  isValidEmail(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  }
  isValidPhoneNumber(phoneNumber: string): boolean {
    const phonePattern = /^\d{6,10}$/;
    return phonePattern.test(phoneNumber);
  }

  hasErrors(): boolean {
    if (this.customer.HoVaTen.length > 0 && this.customer.DiaChi.length > 0 && this.customer.Email.length > 0 && this.isValidEmail(this.customer.Email) && this.isValidPhoneNumber(this.customer.SoDienThoai)) {
      return true;
    }
    return false;
  }

  getcustomer() {
    const data = localStorage.getItem("customer");
    const datas = data ? JSON.parse(data) : [];
    if (data) {
      this.http.get("http://localhost:8000/user/customer/databyid/" + datas.MaKhachHang).subscribe((response: any) => {
        if (response) {
          this.customer.MaKhachHang = response[0].MaKhachHang
          this.customer.HoVaTen = response[0].HoVaTen
          this.customer.DiaChi = response[0].DiaChi
          this.customer.SoDienThoai = response[0].SoDienThoai
          this.customer.Email = response[0].Email
          this.customer.Anh = response[0].Anh
          this.customer.PassWord = response[0].PassWord
          this.customer.XacThucEmail = response[0].XacThucEmail
          this.imageEditSrc = 'http://localhost:8000/' + this.customer.Anh;
          this.currentImg = this.customer.Anh;
        }

      }, (error) => {
        console.error(error);
      })

    }
  }

  getVouchers() {
    const data = localStorage.getItem("customer");
    const datas = data ? JSON.parse(data) : [];
    if (data) {
      this.http.get("http://localhost:8000/user/voucher/getdatabycustomerid/" + datas.MaKhachHang).subscribe((response: any) => {
        this.vouchers = response
      }, (error) => {
        console.log(error);
      })
    }
  }

  getBillofsales(statusCurrent: number) {
    const data = localStorage.getItem("customer");
    const datas = data ? JSON.parse(data) : [];
    if (data) {
      this.http.get("http://localhost:8000/user/billofsale/databycustomerid/" + datas.MaKhachHang).subscribe((response: any) => {

        this.bills = response.filter((element: any) => {
          return element.TrangThai === statusCurrent
        });

        this.onPageChange(this.currentPage)

        this.databillsbypagination.forEach((bill: any) => {
          this.getBillofsalesByCustomerId(bill.MaHoaDon, statusCurrent);
        });

      }, (error) => {
        console.log(error);
      })
    }
  }

  getBillofsalesByCustomerId(id: any, status: number) {
    this.http.get("http://localhost:8000/user/billofsale/datainfoproductsbyid/" + id).subscribe((response: any) => {
      response.forEach((items: any) => {
        if (items.TrangThai === status) {
          this.productinbills.push(response)
        }
      })

    }, (error) => {
      console.error(error);
    })
  }

  checkdate(ngaybd: any, ngaykt: any): boolean {
    let isChecked = false
    let ngaybatdau = new Date(ngaybd);
    let ngayketthuc = new Date(ngaykt)
    if (this.currentDate >= ngaybatdau && this.currentDate <= ngayketthuc) {
      isChecked = true
    }
    return isChecked;
  }

  useVoucher(check: any) {
    if (!check) {
      this.toastmsg.showToast({
        title: "Đã hết hạn sử dụng",
        message: "Voucher này đã hết hạn sử dụng",
        type: "warning"
      })
    } else {
      this.router.navigate(['/'])
    }
  }

  saveStateToSessionStorage(): void {
    const componentState = {
      isInfo: this.isInfo,
      isInfoBill: this.isInfoBill,
      isPassword: this.isPassword,
      isVoucher: this.isVoucher
    };
    sessionStorage.setItem('componentState', JSON.stringify(componentState));
  }

  infoclick() {
    this.router.navigate(['/infouser'])
    this.isInfo = true
    this.isInfoBill = false
    this.isPassword = false
    this.isVoucher = false
    this.saveStateToSessionStorage();
  }

  passwordClick() {
    this.router.navigate(['/infouser'])
    this.isPassword = true
    this.isInfo = false
    this.isInfoBill = false
    this.isVoucher = false
    this.saveStateToSessionStorage();
  }

  voucherclick() {
    this.router.navigate(['/infouser'])
    this.isInfo = false
    this.isInfoBill = false
    this.isPassword = false
    this.isVoucher = true
    this.saveStateToSessionStorage();
  }

  billclick() {
    this.statusDefault = "0"
    this.getBillofsales(parseInt(this.statusDefault))
    this.isInfo = false
    this.isInfoBill = true
    this.isPassword = false
    this.isVoucher = false
    this.saveStateToSessionStorage();
  }

  update() {
    this.submitted = true
    if (this.hasErrors()) {
      if (this.selectedFile) {
        const formData = new FormData();
        formData.append('customerImage', this.selectedFile);
        this.http.post("http://localhost:8000/user/customer/uploadfile", formData).subscribe((response: any) => {
          let path = response.url;
          this.customer.Anh = path;
          console.log(this.customer);

          if (path) {
            console.log(this.customer);

            this.http.post("http://localhost:8000/user/customer/update", this.customer).subscribe((response: any) => {
              console.log(response);

              if (response.result) {
                this.http.delete("http://localhost:8000/user/customer/deleteimg?imageName=" + this.currentImg).subscribe((response: any) => { }
                  , (error) => {
                    console.error(error)
                  })
                // localStorage.setItem("customer",JSON.stringify(this.customer))
                this.toastmsg.showToast({
                  title: "Sửa thông tin thành công",
                  type: "success"
                })
                this.selectedFile = false
                this.fileInput.nativeElement.value = '';
                this.imageSrc = ""
                this.getcustomer();
              }
              else {
                this.toastmsg.showToast({
                  title: "Có lỗi xảy ra vui lòng thử lại sau",
                  type: "warning"
                })
              }
            }, (error) => {
              console.error(error);

            })
          }
        }, (error) => {
          console.error(error);
        })
      }
      else {
        this.http.post("http://localhost:8000/user/customer/update", this.customer).subscribe((response: any) => {
          console.log(response);

          if (response.result) {
            this.toastmsg.showToast({
              title: "Sửa thông tin thành công",
              type: "success"
            })
            this.getcustomer();
          }
          else {
            this.toastmsg.showToast({
              title: "Có lỗi xảy ra vui lòng thử lại sau",
              type: "warning"
            })
          }
        }, (error) => {
          console.error(error);

        })
      }
    } else {

    }

  }

  getcustomerbyidlogin() {
    const data = localStorage.getItem("customer");
    const datas = data ? JSON.parse(data) : [];
    if (data) {
      this.http.get("http://localhost:8000/user/customer/databyid/" + datas.MaKhachHang).subscribe((response: any) => {
        if (response) {
          this.datacustomerbyidlogin = response[0]
        }
      }, (error) => {
        console.error(error);
      })

    }
  }

  sendVerificationEmail(Email:string) {
    this.http.post("http://localhost:8000/user/customer/sendverifyemail",{email:Email}).subscribe((response: any) => {
        console.log(response);
      }, (error) => {
        console.error(error);
      })
  }

  testSendMail(email:string){
    this.http.post("http://localhost:8000/user/customer/sendemail",{email:email}).subscribe((response: any) => {
        console.log(response);
      }, (error) => {
        console.error(error);
      })
  }

  upfile(event: any) {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imageSrc = e.target?.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  destroyBill(data:any){
    if(confirm("Bạn có chắc muốn hủy đơn hàng không?")){
      const param = {
        MaHoaDon: data.MaHoaDon,
        TrangThai:3,
        trangthaithanhtoan:0
      }
      this.http.post("http://localhost:8000/user/billofsale/update",param).subscribe((response:any)=>{
        if(response.result){
          this.toastmsg.showToast({
            title:"Hủy thành công",
            type:"success"
          })
          this.getBillofsales(parseInt(this.statusDefault));
        }
      })
    }
  }

  //change status bill your customer
  statusBill(event: any) {
    const selectedValue = event.target.value;
    this.router.navigate(['/infouser'], { queryParams: { status: '' + selectedValue + '' } })
    this.getBillofsales(parseInt(selectedValue))
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    // Lưu dữ liệu đã phân theo trang vào mảng mới
    const arr: any = []
    const getPoint = this.calculateStartAndEndIndex(this.itemsPerPage, this.bills.length, this.currentPage)
    for (let i = getPoint.startPoint; i <= getPoint.endPoint; i++) {
      arr.push(this.bills[i])
    }
    this.databillsbypagination = arr
  }

  calculateStartAndEndIndex(pagesize: any, totalitems: any, page: any) {
    const startPoint = (page - 1) * pagesize
    const endPoint = Math.min(page * pagesize, totalitems) - 1
    return { startPoint, endPoint }
  }
}
