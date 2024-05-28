import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ToastService } from 'src/app/toast.service';
import * as bcrypt from 'bcryptjs';

@Component({
  selector: 'app-forgetpassword',
  templateUrl: './forgetpassword.component.html',
  styleUrl: './forgetpassword.component.css'
  
})
export class ForgetpasswordComponent {
  email:string = ""
  checkemail:boolean = true

  constructor(private http:HttpClient,private toastmsg:ToastService){}

  forgotPassword(){
    this.http.get("http://localhost:8000/user/customer/getdata").subscribe((reponse: any) => {
      if (reponse) {
        this.checkemail = reponse.some((users: any) => { return users.Email === this.email });
        if(this.checkemail){
          const newpassword = this.generateRandomString(6);
          this.sendMail(this.email,newpassword)
        }
      }
    })
  }

  generateRandomString(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  sendMail(email:string,newpassword:string){
    this.http.post("http://localhost:8000/user/customer/sendemailnewpassword",{email:email,newpassword:newpassword}).subscribe((response: any) => {
      console.log(response,newpassword);
      const customer = {
        Email:email,
        PassWord:this.hashPassword(newpassword)
      }
      console.log(customer);
      
      this.http.post("http://localhost:8000/user/customer/update",customer).subscribe((response: any) => {
        console.log(response);
        this.toastmsg.showToast({
          title:"Đã gửi thông tin mật khẩu vể mail",
          message:"Vui lòng kiểm tra email để xem mật khẩu",
          type:"success",
          duration:10000
        })
      }, (error) => {
        console.error(error);
      })
      
      }, (error) => {
        console.error(error);
      })
  }

  hashPassword(password: string): string {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  }
}
