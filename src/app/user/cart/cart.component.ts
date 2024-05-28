import { Component, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { carts } from 'src/app/model/cart';
import { CartserviceService } from 'src/app/my-service/cartservice.service';
import { ToastService } from 'src/app/toast.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css',
  ]
})

export class CartComponent {
  datacarts: carts[] = [];
  getsum = 0;
  selectedAllProduct: boolean = false;
  selectedItems: any[] = [];
  checkedall:boolean = false
  constructor(
    private cartservice: CartserviceService,
    private toastmsg: ToastService,
    private router: Router
  ) { }
  ngOnInit(): void {
    this.getDataCart()
    console.log(this.getsum);
  }

  getDataCart() {
    this.datacarts = this.cartservice.getCartItems();
    this.getsum = this.datacarts.reduce((sum, value) => sum + (value.Quantity * value.ProductPrice), 0)
    console.log(this.datacarts);
  }

  redirectToCheckout(event: Event) {
    event.preventDefault();

    localStorage.setItem("cartItemsCheckout",JSON.stringify(this.selectedItems))
    
    const data = localStorage.getItem("customer");

    if (!data) {
      this.toastmsg.showToast({
        title: "Bạn cẩn phải đăng nhập",
        message: "Bạn cần phải đăng nhập trước khi thanh toán",
        type: "warning"
      })
    }else if(this.selectedItems.length == 0){
      this.toastmsg.showToast({
        title: "Bạn chưa chọn sản phẩm thanh toán",
        message: "Chọn sản phẩm để tiến hành thanh toán",
        type: "warning"
      })
    }
    else {
      this.router.navigate(["/checkout"]);
    }

  }

  upquantity(cart: carts) {
    cart.Quantity++;
    this.cartservice.updateCart(cart);
    this.getDataCart()
  }

  minusquantity(cart: carts) {
    cart.Quantity--;
    if (cart.Quantity <= 1) {
      cart.Quantity = 1
    }
    console.log(cart);

    this.cartservice.updateCart(cart);
    this.getDataCart()
  }

  deleteCart(id: number, userid: number) {
    if (confirm("Bạn có chắc muốn xóa không?")) {
      this.cartservice.removeFromCart(id, userid);
      this.toastmsg.showToast({
        title: 'Thành công',
        message: 'Xóa sản thành công',
        type: 'success',
        duration: 3000
      });
      this.getDataCart();
    }
  }

  selectedAll(event: any) {
    const isChecked = event.target.checked;
    this.checkedall = isChecked;
    if (isChecked) {
      this.selectedItems = [...this.datacarts];
    } else {
      this.selectedItems = [];
    }
  }
  
  checkedCartProduct(event: any, item: any): void {
    const isChecked = event.target.checked;
    if (isChecked) {
      this.selectedItems.push(item);
    } else {
      this.selectedItems = this.selectedItems.filter(selectedItem => selectedItem !== item);
    }
    this.checkedall = this.selectedItems.length === this.datacarts.length;
  }
}
