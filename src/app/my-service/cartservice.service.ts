import { Injectable } from '@angular/core';
import { carts } from '../model/cart';
import { BehaviorSubject } from 'rxjs';
import { CustomerService } from './customer.service';

@Injectable({
  providedIn: 'root'
})
export class CartserviceService {
  private customerId: number = 0;
  private cartDataByIdCustomer:carts[] = []
  private cartItems: carts[] = [];
  private cartData = new BehaviorSubject<number>(0);
  cartData$ = this.cartData.asObservable();
  constructor(private customerService: CustomerService) {
    // Lấy dữ liệu từ localStorage khi service được khởi tạo
    this.customerService.customerData$.subscribe((customer: any) => {
      if (customer) {
        this.customerId = customer.MaKhachHang
        // Lấy dữ liệu từ localStorage khi service được khởi tạo
        const storedCartItems = localStorage.getItem('cart');
        if (storedCartItems) {
          let datacart = JSON.parse(storedCartItems);
          this.cartItems = [...datacart]
          this.cartDataByIdCustomer = [...datacart.filter((cart: any) =>
            cart.UserID === customer.MaKhachHang
          )]
          
          this.updateCartData();
        }
      } else {
        // Nếu không có dữ liệu khách hàng, đặt giỏ hàng về trạng thái ban đầu
        this.cartDataByIdCustomer = [];
        this.updateCartData();
      }
    });
  }


  private updateLocalStorage(): void {
    // Lưu trữ dữ liệu giỏ hàng vào localStorage
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
    this.updateCartData()
  }

  private updateCartData(): void {
    const totalItems = this.cartItems.reduce((total, item:carts) => 
     {
       if(item.UserID == this.customerId){
        return total + item.Quantity
       }else{
        return total
       }
     }  
    ,0);
    this.cartData.next(totalItems);
  }

  getCartItems(): carts[] {
    return [...this.cartItems.filter((cart: any) =>
      cart.UserID === this.customerId
    )];
  }

  addToCart(cart: carts): void {
    if (cart.UserID !== this.customerId) {
      this.customerId = cart.UserID;
    }

    if (cart.UserID === this.customerId) {
      let datacart: carts[] = this.cartItems;
      let getDataIdCart = datacart.find(x => x.ProductID === cart.ProductID && x.UserID === this.customerId);

      if (getDataIdCart) {
        // Nếu sản phẩm đã tồn tại trong giỏ hàng của khách hàng hiện tại
        if (cart.Quantity > 1) {
          getDataIdCart.Quantity += cart.Quantity;
        } else {
          getDataIdCart.Quantity++;
        }
      } else {
        // Nếu sản phẩm chưa tồn tại trong giỏ hàng, thêm sản phẩm mới vào giỏ hàng
        this.cartItems.push(cart);
      }
      this.updateLocalStorage();
    }
  }

  updateCart(cart: carts) {
    let datacart: carts[] = this.cartItems;
    let getDataIdCart = datacart.find(x => x.ProductID === cart.ProductID && x.UserID === this.customerId) || undefined;
    if (getDataIdCart) {
      getDataIdCart.Quantity = cart.Quantity;
      this.updateLocalStorage();
    }
  }

  removeFromCart(productId: number,userid:number): void {
    this.cartItems = this.cartItems.filter(item => !(item.ProductID === productId && item.UserID === userid));
    this.updateLocalStorage();
  }

  clearCart(): void {
    this.cartItems = [];
    this.updateLocalStorage();
  }

}
