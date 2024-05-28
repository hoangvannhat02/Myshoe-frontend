import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InputvalidationService {

  constructor() { }

  isValidPhoneNumber(phoneNumber: string): boolean {
    const phoneRegex = /^[+]?[0-9\s-]{11}$/;
    return phoneRegex.test(phoneNumber);
  }

  isValidLength(string:string,length:number):boolean{
     if(string.length > length){
      return true;
     }
     return false;
  }

  isRequired(string:string):boolean{
    if(string === ""){
      return false
    }
    return true
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
