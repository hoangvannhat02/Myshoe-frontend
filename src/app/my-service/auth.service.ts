import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false)
  constructor(private afAuth: AngularFireAuth) {}
  login(){
    this.loggedIn.next(true)
  }

  logout(){
    this.loggedIn.next(false)
  }

  isLoggedIn():Observable<boolean>{
    return this.loggedIn.asObservable();
  }

  async sendVerificationEmail(email: string): Promise<void> {
    try {
      // Tạo tài khoản tạm thời
      const userCredential = await this.afAuth.createUserWithEmailAndPassword(email, '123456');
      console.log(userCredential);
      
      const user = userCredential.user;
      
      if (user) {
        // Gửi email xác thực
        await user.sendEmailVerification();
        console.log('Verification email sent.');
      }
    } catch (error) {
      console.error('Error sending verification email:', error);
    }
  }
}
