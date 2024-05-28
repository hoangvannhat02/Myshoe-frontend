import { Component, ViewChild, ElementRef, Renderer2, HostListener } from '@angular/core';
import { ToastService } from '../../toast.service';
import { HttpClient } from '@angular/common/http';
import { CartserviceService } from 'src/app/my-service/cartservice.service';
import { carts } from 'src/app/model/cart';
import { Router } from '@angular/router';
import { PaginationComponent } from 'src/app/help/pagination/pagination.component';
import Swiper from 'swiper';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'
  ]
})
export class HomeComponent {
  @ViewChild('cartInput', { static: false }) cartInput: ElementRef | undefined;
  @ViewChild('addQuantityButton') addQuantityButton!: ElementRef;
  @ViewChild('minusQuantityButton') minusQuantityButton!: ElementRef;
  @ViewChild('cartInput') quantityInput!: ElementRef;

  SoLuongTon = 0;
  products: any[] = [];

  orther:any = {}

  //Thong tin khachhang
  customer: any;

  dataproductsbypagination: any;

  currentPage: number = 1
  itemsPerPage: number = 3

  quantichange = 0;

  dataCart: any;

  databyproductid: any;

  datasizebyproid: any;

  datacolorbyproid: any;

  categoryproducts: any;

  sellingproduct: any = []; // Danh sách sản phẩm bán chạy

  displayedProducts: number = 2; // Số lượng sản phẩm hiển thị

  discountProducts: any = []; // Danh sách sản phẩm có giảm giá

  listDetailProductImg = {
    path1: "",
    path2: "",
    path3: ""
  }
  quanticart = 1;
  detailproduct = [
    {
      DuongDan: "",
      GiaBan: 0,
      GiaKhuyenMai: 0,
      LuotXem: 0,
      MaAnh: "",
      MaChiTietSanPham: 0,
      MaHang: 0,
      MaKichThuoc: 0,
      MaLoai: 0,
      MaMau: 0,
      MaSanPham: 0,
      MoTa: "",
      MoTaNgan: "",
      SoLuongTon: 0,
      TenHang: "",
      TenKichThuoc: "",
      TenMau: "",
      TenSanPham: ""
    }
  ];

  listDetailProductImgQuickView: any = []
  selectedImagePathQuickView: string = '';
  selectedImageIndexQuickview: number = 0;

  constructor(
    private toastService: ToastService,
    private http: HttpClient, private el: ElementRef,
    private renderer: Renderer2,
    private cartservice: CartserviceService,
    private router: Router,
  ) {
    this.customer = JSON.parse(localStorage.getItem("customer")!)
  }
  ngOnInit(): void {
    this.getdata();
    this.getdatacategory();
    this.getsellingproduct();
    this.getDataOrther()
  }

  ngAfterViewInit(): void {
    this.setupEventListeners();
    if (this.cartInput) {
      this.quanticart = this.cartInput.nativeElement.value;
    }
  }

  setupEventListeners() {
    this.renderer.listen(this.addQuantityButton.nativeElement, 'click', () => {
      let quantity = parseInt(this.quantityInput.nativeElement.value) + 1;
      this.renderer.setProperty(this.quantityInput.nativeElement, 'value', quantity.toString());
    });

    this.renderer.listen(this.minusQuantityButton.nativeElement, 'click', () => {
      let quantity = parseInt(this.quantityInput.nativeElement.value) - 1;
      if (quantity < 1) {
        quantity = 1;
      }
      this.renderer.setProperty(this.quantityInput.nativeElement, 'value', quantity.toString());
    });
  }

  addcartdetail(data: any) {
    if (this.customer == null) {
      this.toastService.showToast({
        title: "Bạn chưa đăng nhập",
        message: "Vui lòng đăng nhập để thêm vào giỏ",
        type: "warning"
      })
    } else{
      if (this.cartInput) {
        this.quanticart = this.cartInput.nativeElement.value;
        if (this.quanticart > this.SoLuongTon) {
          this.toastService.showToast({
            title: "Có lỗi xảy ra",
            message: "Số lượng trong kho không đủ chỉ còn: " + this.SoLuongTon + " sản phẩm",
            type: "warning"
          })
        } else {
          let obj: carts = {
            ProductID: data.MaChiTietSanPham,
            ProductName: data.TenSanPham,
            ProductPrice: data.GiaKhuyenMai,
            ProductPath: data.DuongDan,
            Quantity: Number(this.quanticart),
            UserID: this.customer.MaKhachHang,
            ColorID: data.MaMau,
            ColorName: data.TenMau,
            SizeID: data.MaKichThuoc,
            SizeName: data.TenKichThuoc
          }
  
          this.cartservice.addToCart(obj);
  
          this.toastService.showToast({
            title: 'Thành công',
            message: 'Thêm vào giỏ hàng thành công',
            type: 'success',
            duration: 3000
          });
        }
      }  
    }
  }

  getDataOrther(){
    this.http.get("http://localhost:8000/admin/orther/getdata").subscribe((response) => {
      if (response) {
        this.orther = response
        console.log(this.orther);
        
      }
    }, (error) => {
      console.error(error);
    }
    )
  }

  redirectodetail(id: number) {
    this.router.navigate(['/detail', id])
    window.scrollTo(0, 0)
  }

  showMoreSellingProducts(event: any, length: number) {
    event.preventDefault()
    if (this.sellingproduct.layout > length) {
      this.displayedProducts
    }
    this.displayedProducts = length
  }
  addcart(item: any) {    
    if (this.customer == null) {
      this.toastService.showToast({
        title: "Bạn chưa đăng nhập",
        message: "Vui lòng đăng nhập để thêm vào giỏ",
        type: "warning"
      })
    } else {
      let quantity = 1;
      let obj: carts = {
        ProductID: item.MaChiTietSanPham,
        ProductName: item.TenSanPham,
        ProductPrice: item.GiaKhuyenMai,
        ProductPath: item.DuongDan,
        Quantity: quantity,
        UserID: this.customer.MaKhachHang,
        ColorID: item.MaMau,
        ColorName: item.TenMau,
        SizeID: item.MaKichThuoc,
        SizeName: item.TenKichThuoc
      }
      this.cartservice.addToCart(obj);
      this.toastService.showToast({
        title: 'Thành công',
        message: 'Thêm vào giỏ hàng thành công',
        type: 'success',
        duration: 3000
      });
    }


  }

  getdata() {
    this.http.get("http://localhost:8000/user/product/data").subscribe((response: any) => {
      if (response) {
        this.products = response;
        this.getDiscountProducts()
        this.onPageChange(this.currentPage)
      }
    }, (error) => {
      console.error(error);
    })
  }

  getDiscountProducts(): void {
    this.discountProducts = this.products.filter((item: any) => {
      return item.GiaKhuyenMai != 0
    })
    console.log(this.discountProducts);

  }

  getsellingproduct(): void {
    this.http.get("http://localhost:8000/user/billofsale/sellingproduct").subscribe((respone: any) => {
      if (respone) {
        this.sellingproduct = respone
      }
    })
  }

  getdatacategory() {
    this.http.get("http://localhost:8000/user/categoryproduct/data").subscribe((response: any) => {
      if (response) {
        this.categoryproducts = response;
      }
    }, (error) => {
      console.error(error);
    })
  }

  enableclick(event: Event) {
    event.preventDefault();
  }

  solvediscount(originalPrice: number, discountedPrice: number): number {
    return Math.ceil((originalPrice - discountedPrice) / originalPrice * 100);
  }

  onChangeSize(event: any) {
    let sizeid = event.target.value;

    const data = this.databyproductid.find((item: any) => item.MaKichThuoc === Number(sizeid));

    let params = {
      proid: data.MaSanPham,
      colorid: data.MaMau,
      sizeid: sizeid
    }

    this.http.post("http://localhost:8000/user/product/dataquantyofsize", params).subscribe((response: any) => {
      if (response) {
        // this.datasizebyproid = response
        this.SoLuongTon = response[0].SoLuongTon;
        this.dataCart = response[0]
        console.log(response);

      }
    }, (error) => {
      console.error(error);
    })
  }

  onChangeColor(event: any) {
    let colorid = event.target.value;

    const data = this.datacolorbyproid.find((item: any) => item.MaMau === Number(colorid));
    let params = {
      detailproid: data.MaChiTietSanPham,
      colorid: colorid
    }
    console.log(params);

    this.http.post("http://localhost:8000/user/product/getimgbycolorid", params).subscribe((response: any) => {
      console.log(response);
      if (response) {

        this.SoLuongTon = response[0].SoLuongTon;
        this.listDetailProductImgQuickView = []
        this.selectedImageIndexQuickview = 0
        response.forEach((data: any) => {
          this.listDetailProductImgQuickView.push(data.DuongDan)
        })
        this.selectedImagePathQuickView = 'http://localhost:8000/' + this.listDetailProductImgQuickView[0]

        let data = {
          proid: response[0].MaSanPham,
          colorid: response[0].MaMau
        }
        this.http.post("http://localhost:8000/user/product/datasize", data).subscribe((response: any) => {
          console.log(response);

          if (response) {
            this.datasizebyproid = response
            this.dataCart = this.datasizebyproid[0]
            console.log(this.datasizebyproid);
          }
        }, (error) => {
          console.error(error);
        })
      }
    }, (error) => {
      console.error(error);
    })
  }

  showquickview(event: Event, id: any, colorid: any) {
    event.preventDefault();
    let params = {
      proid: id,
      colorid: colorid
    }
    let quickviewelement = this.el.nativeElement.querySelector('.quickView');

    if (quickviewelement) {
      this.http.post("http://localhost:8000/user/product/databyid", params).subscribe((response: any) => {
        if (response) {
          console.log(response);

          this.detailproduct = response;
          this.dataCart = this.detailproduct[0];
          this.SoLuongTon = this.detailproduct[0].SoLuongTon;
          this.selectedImagePathQuickView = 'http://localhost:8000/' + this.detailproduct[0].DuongDan
          this.listDetailProductImgQuickView = []
          this.detailproduct.forEach((data: any) => {
            this.listDetailProductImgQuickView.push(data.DuongDan)
          })
        }
      }, (error) => {
        console.error(error);
      })

      this.http.get("http://localhost:8000/user/product/datacolor/" + id).subscribe((response: any) => {
        if (response) {
          this.datacolorbyproid = response;
        }
      }, (error) => {
        console.error(error);
      })

      this.http.get("http://localhost:8000/user/product/dataproductbyid/" + id).subscribe((response: any) => {
        if (response) {
          this.databyproductid = response;
        }
      }, (error) => {
        console.error(error);
      })

      this.http.post("http://localhost:8000/user/product/datasize", params).subscribe((response: any) => {
        if (response) {
          this.datasizebyproid = response
          console.log(this.datasizebyproid);

        }
      }, (error) => {
        console.error(error);
      })
    }

    this.renderer.setStyle(quickviewelement, 'display', 'block');

    // Gọi hàm hiddenquickview khi click vào overlay hoặc close
    quickviewelement.addEventListener('click', (event: any) => {
      if (event.target.classList.contains('quickView__overlay') || event.target.classList.contains('quickView__close') || event.target.classList.contains('fa-xmark')) {
        this.hiddenquickview();
      }
    });
  }
  hiddenquickview() {
    const quickViewElement = this.el.nativeElement.querySelector('.quickView');
    // Sử dụng Renderer2 để thực hiện các thay đổi trên phần tử
    if (quickViewElement) {
      this.renderer.setStyle(quickViewElement, 'display', 'none');
    }
  }

  onPageChange(page: any): void {
    this.currentPage = page;
    // Lưu dữ liệu đã phân theo trang vào mảng mới
    const arr: any = []
    const getPoint = this.calculateStartAndEndIndex(this.itemsPerPage, this.products.length, this.currentPage)
    for (let i = getPoint.startPoint; i <= getPoint.endPoint; i++) {
      arr.push(this.products[i])
    }
    this.dataproductsbypagination = arr

    console.log(this.dataproductsbypagination);

  }

  calculateStartAndEndIndex(pagesize: any, totalitems: any, page: any) {
    const startPoint = (page - 1) * pagesize
    const endPoint = Math.min(page * pagesize, totalitems) - 1
    return { startPoint, endPoint }
  }

  selectImageQuickView(index: any) {
    this.selectedImagePathQuickView = 'http://localhost:8000/' + this.listDetailProductImgQuickView[index]
    this.selectedImageIndexQuickview = index

    document.querySelectorAll(".slick-slide").forEach((el) => {
      el.classList.remove('active')
    })

    document.querySelectorAll(".slick-slide")[index].classList.add("active")
  }

  // Phần slider show

}
