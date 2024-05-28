import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import firebase from 'firebase/compat/app';
import { ToastService } from 'src/app/toast.service';
import { environment } from 'src/environments/environment';
import * as bcrypt from 'bcryptjs';

@Component({
  selector: 'app-phoneotp',
  templateUrl: './phoneotp.component.html',
  styleUrls: ['./phoneotp.component.css']
})
export class PhoneotpComponent {
  verificationId: any
  otp: any
  config = {
    length: 6,
    allowNumbersOnly: true,
    disableAutoFocus: false,
    placeholder: '',
    inputStyles: {
      with: '50px',
      height: '50px'
    }
  }

  constructor(private afAuth: AngularFireAuth,
    private toastservice: ToastService,
    private router: Router,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    firebase.initializeApp(environment.firebase)
  }

  handleclickverify() {
    this.verificationId = JSON.parse(localStorage.getItem('verificationId')!) ?? ""
    var credentials = firebase.auth.PhoneAuthProvider.credential(
      this.verificationId,
      this.otp
    );

    firebase.auth().signInWithCredential(credentials).then((response) => {
      const userdata = JSON.parse(sessionStorage.getItem('user')!) ?? {}
      userdata.XacThucSoDienThoai = 1
      userdata.PassWord = this.hashPassword(userdata.PassWord)
      this.http.post("http://localhost:8000/user/customer/create", userdata).subscribe((response: any) => {
        if (response) {
          this.http.get("http://localhost:8000/user/customer/getdatanew").subscribe((response: any) => {
            if (response) {
              Object.assign(userdata, { MaKhachHang: response[0].MaKhachHang })
              
              localStorage.setItem("customer", JSON.stringify(userdata))
              sessionStorage.clear()
              this.toastservice.showToast({
                title: "Xác thực thành công",
                message: "Đang đăng nhập và chuyển về trang chủ",
                type: "success",
                duration: 4000
              })

              setTimeout(() => {
                this.router.navigate(['/'])
              }, 5000)
            }
          })
        }
        else {
          console.log(response);
          alert("Thêm thất bại")
        }

      }, (error) => {
        console.error(error);
      })


    }, (error) => {
      alert(error)
    })
  }

  hashPassword(password:string):string {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  }

  onOtpChange(event: any) {
    this.otp = event
  }
}
