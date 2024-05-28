import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private customerData = new BehaviorSubject<any>(null);
  customerData$ = this.customerData.asObservable();
  constructor() {
    const storedCustomer = JSON.parse(localStorage.getItem('customer')!);
    if (storedCustomer) {
      this.customerData.next(storedCustomer);
    }
  }

  updateCustomer(customer: any): void {
    localStorage.setItem('customer', JSON.stringify(customer));
    this.customerData.next(customer);
  }

  // Xóa dữ liệu khách hàng khỏi localStorage
  clearCustomer(): void {
    localStorage.removeItem('customer');
    this.customerData.next(null);
  }
}
