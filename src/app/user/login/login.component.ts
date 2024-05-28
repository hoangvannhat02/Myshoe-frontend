import { FacebookLoginProvider, GoogleLoginProvider, SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { InputvalidationService } from 'src/app/my-service/inputvalidation.service';
import { ToastService } from 'src/app/toast.service';
import firebase from 'firebase/compat/app';
import { environment } from 'src/environments/environment';
import { CustomerService } from 'src/app/my-service/customer.service';
import * as bcrypt from 'bcryptjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css',
    '../../../assets/my-ui/css/login.css'
  ]
})
export class LoginComponent {

  users = {
    email: "",
    password: "",
    name: "",
    phone: "",
    address: ""
  }

  user_registration = {
    email: "",
    password: "",
    name: "",
    phone: "",
    address: ""
  }

  message_resgistration = {
    email: "",
    password: "",
    name: "",
    phone: "",
    address: ""
  }

  message = {
    email: "",
    password: "",
  }

  customer: any;
  isEmailInvalid = false
  isPasswordInvalid = false
  isEmailResgisInvalid = false
  isPasswordResgisInvalid = false
  isNameInvalid = false
  isPhoneInvalid = false
  isAddressInvalid = false

  socialUser!: SocialUser;
  isLoggedin!: boolean;
  constructor(private el: ElementRef,
    private router: Router,
    private renderer: Renderer2,
    private valid: InputvalidationService,
    private http: HttpClient,
    private toatmsg: ToastService,
    private socialAuthService: SocialAuthService,
    private customerService:CustomerService
  ) {}
  async ngOnInit() {    
    const check = await this.comparePasswords('123','$2a$10$eQXtAvX7y4LM0bWJXwTzL.NnS9PcoDafxyCX2r0y3n30y2ZIB8aQy')
    console.log(check);    
    
    firebase.initializeApp(environment.firebase)
    this.socialAuthService.authState.subscribe((user: SocialUser) => {
      this.socialUser = user;
      this.isLoggedin = user != null;
      if (this.isLoggedin) {
        this.http.get("http://localhost:8000/user/customer/getdata").subscribe((response: any) => {
          if (response) {
            const users = response
            const ischeckemailuser = users.filter((item: any) => {
              return item.Email == this.socialUser.email
            })
            if (ischeckemailuser) {
              console.log(ischeckemailuser);
              const param = {
                MaKhachHang: ischeckemailuser[0].MaKhachHang,
                HoVaTen: this.socialUser.name,
                DiaChi: ischeckemailuser[0].DiaChi ?? "",
                SoDienThoai: ischeckemailuser[0].SoDienThoai ?? "",
                Email: this.socialUser.email,
                Anh: this.socialUser.photoUrl
              }
              localStorage.setItem("customer", JSON.stringify(param))
              this.toatmsg.showToast({
                title: "Đăng nhập thành công, đang chuyển trang",
                message: "Xin chào, " + this.socialUser.name,
                type: "success"
              })
              setTimeout(() => {
                this.router.navigate(["/"])
              }, 3000)
            } else {
              let params = {
                Email: this.socialUser.email,
                Anh: this.socialUser.photoUrl,
                HoVaTen: this.socialUser.name,
                IdGoogle: this.socialUser.id
              }
              this.http.post("http://localhost:8000/user/customer/create", params).subscribe((response: any) => {
                if (response) {
                  localStorage.setItem("customer", JSON.stringify(params))
                  this.toatmsg.showToast({
                    title: "Đăng nhập thành công, đang chuyển trang",
                    message: "Xin chào, " + this.socialUser.name,
                    type: "success"
                  })
                  setTimeout(() => {
                    this.router.navigate(["/"])
                  }, 3000)
                }
              }, (error) => {
                console.error(error);
              })
            }
          }
          else {
            console.log(response);
          }

        }, (error) => {
          console.error(error);
        })
      } else {
        console.log('Người dùng chưa đăng nhập.');
      }

    });

  }

  refreshToken(): void {
    this.socialAuthService.refreshAuthToken(GoogleLoginProvider.PROVIDER_ID);
  }

  ngAfterViewInit() {
    const signUpButton = this.el.nativeElement.querySelector('#signUp');
    const signInButton = this.el.nativeElement.querySelector('#signIn');
    const container = this.el.nativeElement.querySelector('#container');

    signUpButton.addEventListener('click', () => {
      this.renderer.addClass(container, 'right-panel-active');
    });

    signInButton.addEventListener('click', () => {
      this.renderer.removeClass(container, 'right-panel-active');
    });
  }

  onInputEmail() {
    this.isEmailInvalid = false
  }
  onInputPassWord() {
    this.isPasswordInvalid = false
  }
  onInputRegisEmail() {
    this.isEmailResgisInvalid = false
  }
  onInputRegisPassWord() {
    this.isPasswordResgisInvalid = false
  }
  onInputName() {
    this.isNameInvalid = false
  }
  onInputPhonenumber() {
    this.isPhoneInvalid = false
  }
  onInputAddressnumber() {
    this.isAddressInvalid = false
  }

  onSubmit() {
    if (!this.users.email.length) {
      this.isEmailInvalid = true;
      this.message.email = "Thông tin tài khoản không được để trống"
    } else if (!this.valid.isValidEmail(this.users.email)) {
      this.isEmailInvalid = true;
      this.message.email = "Không đúng định dạng email"
    } else {
      this.isEmailInvalid = false;
    }


    if (this.users.password.length <= 0) {
      this.isPasswordInvalid = true;
      this.message.password = "Thông tin mật khẩu không được để trống"
    } else if (this.valid.isValidLength(this.users.password, 8)) {
      this.isPasswordInvalid = true;
      this.message.password = "Chỉ có thể nhập tối đa 8 ký tự"
    }
    else {
      this.isPasswordInvalid = false;
    }

    if (!this.isEmailInvalid && !this.isPasswordInvalid) {
      let params = {
        Email: this.users.email,
        PassWord: this.users.password
      }
      this.http.post("http://localhost:8000/user/customer/login", params).subscribe((response: any) => {
        if (response.result.length > 0) {
          const data = localStorage.getItem("customer")
          const datausers = data ? JSON.parse(data) : []
          if (datausers.length === 0) {
            const users = {
              MaKhachHang: response.result[0].MaKhachHang,
              HoVaTen: response.result[0].HoVaTen,
              DiaChi: response.result[0].DiaChi,
              SoDienThoai: response.result[0].SoDienThoai,
              Email: response.result[0].Email,
              Anh: response.result[0].Anh,
              PassWord: response.result[0].PassWord
            }
            localStorage.setItem("customer", JSON.stringify(users))
            this.customerService.updateCustomer(users)
            this.toatmsg.showToast({
              title: "Đăng nhập thành công",
              message: "Xin chào, " + users.HoVaTen,
              type: "success",
              duration:3000
            })
            setTimeout(() => {
              this.router.navigate(["/"])
            }, 3000)

          }
          else {
            setTimeout(() => {
              this.toatmsg.showToast({
                title: "Đăng nhập thành công",
                message: "Chào mừng bạn đến với cửa hàng",
                type: "success"
              })
              this.router.navigate(["/"])
            }, 3000)
          }

        }
        else {
          this.isPasswordInvalid = true
          this.message.password = "Tài khoản hoặc mật khẩu không chính xác"
        }


      }, (error) => {
        console.error(error);
      })
    }
  }

  onSubmitRegistration() {
    let userAlready = new Array
    
    this.http.get("http://localhost:8000/user/customer/getdata").subscribe((reponse: any) => {
      if (reponse) {
        let isCheckEmailAlready = false
        let isCheckPhoneAlready = false
        userAlready = reponse

        isCheckEmailAlready = userAlready.some((users: any) => { return users.Email === this.user_registration.email });
        isCheckPhoneAlready = userAlready.some((users: any) => { 
         return users.SoDienThoai === this.users.phone });
        if (!this.user_registration.email.length) {
          this.isEmailResgisInvalid = true;
          this.message_resgistration.email = "Thông tin tài khoản không được để trống"
        } else if (!this.valid.isValidEmail(this.user_registration.email)) {
          this.isEmailResgisInvalid = true;
          this.message_resgistration.email = "Không đúng định dạng email"
        }
        else if (isCheckEmailAlready) {
          this.isEmailResgisInvalid = true;
          this.message_resgistration.email = "Email đã tồn tại trong hệ thống"
        }
        else {
          this.isEmailResgisInvalid = false;
        }


        if (!this.users.phone.length) {
          this.isPhoneInvalid = true;
          this.message_resgistration.phone = "Thông tin số điện thoại không được để trống"
        } else if (this.valid.isValidPhoneNumber(this.users.phone)) {
          this.isPhoneInvalid = true;
          this.message_resgistration.phone = "Chỉ có thể nhập tối đa 10 số"
        }
        else if (isCheckPhoneAlready) {
          this.isPhoneInvalid = true;
          this.message_resgistration.phone = "Số điện thoại đã tồn tại trong hệ thống, thử số khác"
        }
        else {
          this.isPhoneInvalid = false;
        }


      }
    }, (error) => {
      console.log(error);
    })




    if (!this.user_registration.password.length) {
      this.isPasswordResgisInvalid = true;
      this.message_resgistration.password = "Thông tin mật khẩu không được để trống"
    } else if (this.valid.isValidLength(this.users.password, 8)) {
      this.isPasswordResgisInvalid = true;
      this.message_resgistration.password = "Chỉ có thể nhập tối đa 8 ký tự"
    }
    else {
      this.isPasswordResgisInvalid = false;
    }

    if (!this.users.name.length) {
      this.isNameInvalid = true;
      this.message_resgistration.name = "Thông tin họ tên không được để trống"
    } else if (this.valid.isValidLength(this.users.name, 100)) {
      this.isNameInvalid = true;
      this.message_resgistration.name = "Chỉ có thể nhập tối đa 100 ký tự"
    }
    else {
      this.isNameInvalid = false;
    }

    if (!this.users.address.length) {
      this.isAddressInvalid = true;
      this.message_resgistration.address = "Thông tin địa chỉ không được để trống"
    } else if (this.valid.isValidLength(this.users.address, 200)) {
      this.isAddressInvalid = true;
      this.message_resgistration.address = "Chỉ có thể nhập tối đa 100 ký tự"
    }
    else {
      this.isAddressInvalid = false;
    }

    if (!this.isEmailResgisInvalid && !this.isPasswordResgisInvalid && !this.isAddressInvalid && !this.isNameInvalid && !this.isPhoneInvalid) {
      let params = {
        Email: this.user_registration.email,
        PassWord: this.user_registration.password,
        SoDienThoai: this.users.phone,
        DiaChi: this.users.address,
        Anh: "",
        HoVaTen: this.users.name,
        XacThucEmail: 0,
        XacThucSoDienThoai: 0,
        IdGoogle: "",
        IdUserFacebook: ""
      }
      sessionStorage.setItem('user', JSON.stringify(params))
      this.sendOTP(params.SoDienThoai)
    }
  }
  loginWithGoogle() {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID).then((user: SocialUser) => {
      console.log('User logged in:', user);
    }).catch((error) => {
      console.error('Error logging in:', error);
    });
  }

  signInWithFB(event: Event): void {
    event.preventDefault()
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID).then((user: SocialUser) => {
      this.socialUser = user;
      this.isLoggedin = user != null;
      if (this.isLoggedin) {
        this.http.get("http://localhost:8000/user/customer/getdata").subscribe((response: any) => {
          if (response) {
            const users = response
            const ischeckemailuser = users.filter((item: any) => {
              return item.Email == this.socialUser.email
            })

            if (ischeckemailuser.length == 1) {
              const param = {
                MaKhachHang: ischeckemailuser[0]?.MaKhachHang,
                HoVaTen: this.socialUser.name,
                DiaChi: ischeckemailuser[0].DiaChi ?? "",
                SoDienThoai: ischeckemailuser[0].SoDienThoai ?? "",
                Email: this.socialUser.email,
                Anh: this.socialUser.photoUrl
              }
              localStorage.setItem("customer", JSON.stringify(param))
              this.toatmsg.showToast({
                title: "Đăng nhập thành công, đang chuyển trang",
                message: "Xin chào, " + this.socialUser.name,
                type: "success"
              })
              setTimeout(() => {
                this.router.navigate(["/"])
              }, 3000)
            } else {
              console.log(1);
              
              let params = {
                Email: this.socialUser.email,
                Anh: this.socialUser.photoUrl,
                HoVaTen: this.socialUser.name,
                IdUserFacebook: this.socialUser.id
              }
              this.http.post("http://localhost:8000/user/customer/create", params).subscribe((response: any) => {
                if (response.result) {
                  this.http.get("http://localhost:8000/user/customer/getdatanew").subscribe((response: any) => {
                    if (response) {
                      Object.assign(params, { MaKhachHang: response.MaKhachHang })
                      localStorage.setItem("customer", JSON.stringify(params))
                      this.toatmsg.showToast({
                        title: "Đăng nhập thành công, đang chuyển trang",
                        message: "Xin chào, " + this.socialUser.name,
                        type: "success"
                      })
                      setTimeout(() => {
                        this.router.navigate(["/"])
                      }, 3000)
                    }
                  })

                }
              }, (error) => {
                console.error(error);
              })
            }
          }
          else {
            console.log(response);
          }

        }, (error) => {
          console.error(error);
        })
      } else {
        console.log('Người dùng chưa đăng nhập.');
      }

    })
  }

  sendOTP(phonenumber: any) {
    const appVerifier = new firebase.auth.RecaptchaVerifier('sigin-phone-btn', {
      size: 'invisible'
    });
    firebase.auth().signInWithPhoneNumber(this.convertPhoneNumber(phonenumber), appVerifier)
      .then((verification) => {
        localStorage.setItem('verificationId', JSON.stringify(verification.verificationId))
        this.router.navigate(['/phoneotp'])
      })
      .catch((error) => {
        console.log(error);
      });
  }


  hashPassword(password:string):string {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  }

  comparePasswords(password: string, hashedPassword: string): boolean {
    return bcrypt.compareSync(password, hashedPassword);
  }

  convertPhoneNumber(phoneNumber: string): string {
    if (phoneNumber.startsWith('0')) {
        return '+84' + phoneNumber.slice(1);
    } else {
        return phoneNumber;
    }
}
}
