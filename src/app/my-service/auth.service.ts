import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { CustomerService } from './customer.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject:BehaviorSubject<SocialUser | null>
  private user:Observable<SocialUser | null>
  constructor(private afAuth: AngularFireAuth,  
    private socialAuthService:SocialAuthService,
    private customerService: CustomerService
  ) {
    this.userSubject = new BehaviorSubject<SocialUser | null>(null)
    this.user = this.userSubject.asObservable()

    this.socialAuthService.authState.subscribe((user)=>{
      this.userSubject.next(user)
    })
  }

  signOut(): void {
    this.socialAuthService.signOut().then(() => {
      this.userSubject.next(null);
    });
  }

  getUser(): Observable<SocialUser | null> {
    return this.user;
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
