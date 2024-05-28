import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ElementRef, Renderer2 } from '@angular/core';
import { ToastService } from 'src/app/toast.service';
import { DatePipe } from '@angular/common';
import { carts } from 'src/app/model/cart';
import { CartserviceService } from 'src/app/my-service/cartservice.service';


@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css',
  ]
})
export class DetailComponent {
  @ViewChild('cartInput', { static: false }) cartInput: ElementRef | undefined;

  @ViewChild('addQuantityButton') addQuantityButton!: ElementRef;
  @ViewChild('minusQuantityButton') minusQuantityButton!: ElementRef;
  @ViewChild('cartInput') quantityInput!: ElementRef;

  @ViewChild('star1') star1!: ElementRef<HTMLDivElement>;
  @ViewChild('star2') star2!: ElementRef<HTMLDivElement>;
  @ViewChild('star3') star3!: ElementRef<HTMLDivElement>;
  @ViewChild('star4') star4!: ElementRef<HTMLDivElement>;
  @ViewChild('star5') star5!: ElementRef<HTMLDivElement>;

  //Thong tin khach hang
  customer:any

  SoLuongTon = 0;
  SoLuongTonXemNhanh = 0;

  detailproduct: any;
  detailproductQuickView: any;
  datacolorbyproid: any;
  databyproductid: any;
  datasizebyproid: any;
  selectedSize = 0;
  selectedFile: any;
  imageSrc: any;
  users: any[] = [];

  dataCart: any;
  quanticart = 1;
  quantityCartDetail: number = 1;

  relatedProduct: any;

  feedBack1star: any
  feedBack2star: any
  feedBack3star: any
  feedBack4star: any
  feedBack5star: any
  feedBackMediumStar: any

  feedBacks: any[] = []

  feedBack: any = {
    BinhLuan: "",
    SoSao: 0,
    NgayDang: Date.now(),
    HinhAnh: "",
    MaKhachHang: 0,
    MaSanPham: 0
  }

  stars: number[] = []

  selectedStars: number = -1;

  activeTabIndex = 0;

  listDetailProductImg: any = []
  selectedImagePath: string = '';
  selectedImageIndex: number = 0;

  //Lay thong tin va hien thi phan quickview
  listDetailProductImgQuickView: any = []
  selectedImagePathQuickView: string = '';
  selectedImageIndexQuickview: number = 0;
  dataquickviebyproductid: any;
  datacolorquickviewbyproid: any;
  dataCartQuickview: any;
  datasizequickviewbyproid: any;

  //id url
  id: any;
  constructor(private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private el: ElementRef,
    private renderer: Renderer2,
    private toastmsg: ToastService,
    private datePiPe: DatePipe,
    private cartservice: CartserviceService
  ) {
      this.customer = JSON.parse(localStorage.getItem("customer")!)
   };

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id')
    this.route.queryParams.subscribe(params => {
      let number = params['status']
      if (number) {
        this.activeTabIndex = number
      }
    })

    this.getdatabyid(this.id);
    this.getRealtedProduct();
    this.getFeedback(this.id);
    this.getUsers();
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

  getStars(star: number): any[] {
    this.stars = Array(star).fill(0).map((x, i) => i);
    return this.stars
  }

  hoverStar(nb: number) {
    let stars = [this.star1, this.star2, this.star3, this.star4, this.star5]
    if (nb <= stars.length) {
      for (let i = nb; i >= 0; i--) {
        stars[i].nativeElement.classList.add('active')
      }
      nb++
      for (let i = nb; i <= stars.length - 1; i++) {
        stars[i].nativeElement.classList.remove('active')
      }
    }

  }

  resetStars() {
    let stars = [this.star1, this.star2, this.star3, this.star4, this.star5];
    stars.forEach((star, index) => {
      if (index <= this.selectedStars) {
        star.nativeElement.classList.add('active');
      } else {
        star.nativeElement.classList.remove('active');
      }
    });
  }

  newStars() {
    this.feedBack.star = 0
    this.selectedStars = -1
    let stars = [this.star1, this.star2, this.star3, this.star4, this.star5];
    stars.forEach((star) => {
      star.nativeElement.classList.remove('active');
    });
  }

  downQuantityCartDetail() {
    this.quantityCartDetail++
  }
  upQuantityCartDetail() {
    this.quantityCartDetail--
    if (this.quantityCartDetail <= 1) {
      this.quantityCartDetail = 1
    }
  }

  clickStar(star: any) {
    this.selectedStars = star
    this.feedBack.SoSao = star + 1
    let stars = [this.star1, this.star2, this.star3, this.star4, this.star5]
    for (let i = star; i >= 0; i--) {
      stars[i].nativeElement.classList.add('active')
    }
  }

  btnEvaluate() {
    let userid = JSON.parse(localStorage.getItem("customer")!)
    if (this.feedBack.SoSao === 0) {
      this.toastmsg.showToast({
        title: "Bạn chưa chọn số sao muốn đánh giá",
        message: "vui lòng chọn số sao bạn muốn đánh giá về sản phẩm",
        duration: 5000,
        type: "warning"
      })
    }
    else if (this.feedBack.BinhLuan === "") {
      this.toastmsg.showToast({
        title: "Bạn chưa đánh giá về sản phẩm",
        message: "vui lòng nhập thông tin đánh giá về sản phẩm",
        duration: 5000,
        type: "warning"
      })
    }
    else if (!userid) {
      this.toastmsg.showToast({
        title: "Bạn chưa đăng nhập",
        message: "vui lòng đăng nhập để đánh giá sản phẩm ",
        duration: 5000,
        type: "warning"
      })
    }
    else {
      this.feedBack.MaKhachHang = userid.MaKhachHang
      this.feedBack.MaSanPham = this.id
      const formattedDate = this.datePiPe.transform(new Date(this.feedBack.NgayDang), 'yyyy-MM-dd HH:mm:ss');
      this.feedBack.NgayDang = formattedDate
      if (this.selectedFile) {
        const formData = new FormData();
        formData.append('feedbackImage', this.selectedFile);
        this.http.post("http://localhost:8000/user/evaluate/uploadfile", formData).subscribe((response: any) => {
          let path = response.url;
          this.feedBack.HinhAnh = path;
          if (path) {
            this.http.post("http://localhost:8000/user/evaluate/create", this.feedBack).subscribe((response: any) => {
              console.log(response);

              if (response.result) {
                this.newStars()
                this.feedBack.BinhLuan = ""
                this.feedBack.SoSao = 0
                this.feedBack.MaKhachHang = 0
                this.feedBack.MaSanPham = 0
                this.feedBack.HinhAnh = ""
                this.getFeedback(this.id)
              }
              else {
                console.log(response.message);
              }
            }, (error) => {
              console.error(error);

            })
          }
        }, (error) => {
          console.error(error);
        })
      }
      else {
        this.http.post("http://localhost:8000/user/evaluate/create", this.feedBack).subscribe((response: any) => {
          if (response.result) {
            this.getFeedback(this.id)
          }
          else {
            console.log(response.message);
          }
        }, (error) => {
          console.error(error);

        })
      }
    }


  }

  getFeedback(id: number) {
    this.http.get("http://localhost:8000/user/evaluate/getdata").subscribe((response: any) => {
      if (response) {

        this.feedBacks = response.filter((data: any) => data.MaSanPham == id)
        console.log(this.feedBacks);

        this.feedBack1star = this.feedBacks.filter((item: any) =>
          item.SoSao == 1
        ).length
        this.feedBack2star = this.feedBacks.filter((item: any) =>
          item.SoSao == 2
        ).length
        this.feedBack3star = this.feedBacks.filter((item: any) =>
          item.SoSao == 3
        ).length
        this.feedBack4star = this.feedBacks.filter((item: any) =>
          item.SoSao == 4
        ).length
        this.feedBack5star = this.feedBacks.filter((item: any) =>
          item.SoSao == 5
        ).length
        if (this.feedBacks.length == 0) {
          this.feedBackMediumStar = 0
        } else {
          this.feedBackMediumStar = (this.feedBacks.reduce((sum: number, item: any) => item.SoSao + sum, 0)) / this.feedBacks.length
        }
      }
      else {
        console.log(response.message);
      }
    }, (error) => {
      console.error(error);

    })
  }

  getImageCustomerId(id: number): string {
    let img = ""
    const user = this.users.find((item: any) => item.MaKhachHang == id)
    if (user.Anh.startsWith("https://") || user.Anh.startsWith("http://")) {
      img = user.Anh
    } else if (user.Anh == "") {
      img = "./assets/my-ui/image/user7.jpg"
    }
    else {
      img = "http://localhost:8000/" + user.Anh
    }

    return img
  }

  getUsers() {
    this.http.get("http://localhost:8000/user/customer/getdata").subscribe((response: any) => {
      if (response) {
        this.users = response
        console.log(this.users);

      }
      else {
        console.log(response.message);
      }
    }, (error) => {
      console.error(error);

    })
  }

  upfile(event: any) {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imageSrc = e.target?.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  solvediscount(originalPrice: number, discountedPrice: number): number {
    return Math.ceil((originalPrice - discountedPrice) / originalPrice * 100);
  }

  selectImage(index: number) {
    // Cập nhật đường dẫn ảnh và chỉ số của ảnh được chọn
    this.selectedImagePath = 'http://localhost:8000/' + this.listDetailProductImg[index];
    this.selectedImageIndex = index;

    // Xóa lớp active từ tất cả các ảnh
    document.querySelectorAll('.slick-slide').forEach((el) => {
      el.classList.remove('active');
    });

    // Thêm lớp active cho ảnh được chọn
    document.querySelectorAll('.slick-slide')[index].classList.add('active');
  }

  getdatabyid(id: any) {
    this.http.get("http://localhost:8000/user/product/dataproductbyid/" + id).subscribe((response: any) => {
      if (response) {
        this.detailproduct = response;
        this.dataCart = this.detailproduct[0];
        this.SoLuongTon = this.detailproduct[0]?.SoLuongTon;
        this.selectedSize = this.detailproduct[0]?.MaKichThuoc;
        this.http.post("http://localhost:8000/user/product/getimgbycolorid", {
          detailproid: this.detailproduct[0].MaChiTietSanPham,
          colorid: this.detailproduct[0].MaMau
        }).subscribe((response: any) => {
          if (response) {
            this.selectedImagePath = 'http://localhost:8000/' + response[0]?.DuongDan;
            response.forEach((data: any) => {
              this.listDetailProductImg.push(data.DuongDan)
            })

          }
        }, (error) => {
          console.error(error);
        })

        let params = {
          proid: id,
          colorid: this.detailproduct[0].MaMau
        }

        this.http.post("http://localhost:8000/user/product/datasize", params).subscribe((response: any) => {
          if (response) {
            this.datasizebyproid = response

          }
        }, (error) => {
          console.error(error);
        })

        this.http.get("http://localhost:8000/user/product/datacolor/" + this.id).subscribe((response: any) => {
          if (response) {
            this.datacolorbyproid = response;
          }
        }, (error) => {
          console.error(error);
        })

        this.http.get("http://localhost:8000/user/product/dataproductbyid/" + this.id).subscribe((response: any) => {
          if (response) {
            this.databyproductid = response;
          }
        }, (error) => {
          console.error(error);
        })

      }
    }, (error) => {
      console.error(error);
    })
  }

  getRealtedProduct() {
    this.http.get("http://localhost:8000/user/product/data").subscribe((response: any) => {
      if (response) {
        this.relatedProduct = response.filter((data: any) => (data.MaLoai == this.detailproduct[0].MaLoai || data.MaHang == this.detailproduct[0].MaHang) && data.MaSanPham != this.id);
        console.log(this.relatedProduct);
      }
    }, (error) => {
      console.error(error);
    })
  }

  onChangeSize(event: any) {
    let sizeid = this.selectedSize;

    const data = this.databyproductid.find((item: any) => item.MaKichThuoc === Number(sizeid));
    console.log(data);

    let params = {
      proid: data.MaSanPham,
      colorid: data.MaMau,
      sizeid: sizeid
    }

    this.http.post("http://localhost:8000/user/product/dataquantyofsize", params).subscribe((response: any) => {
      if (response) {
        // this.datasizebyproid = response
        this.dataCart = this.datasizebyproid[0]

        this.SoLuongTon = response[0].SoLuongTon;
        console.log(response);

        console.log(this.SoLuongTon);

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
    this.http.post("http://localhost:8000/user/product/getimgbycolorid", params).subscribe((response: any) => {
      if (response) {
        this.SoLuongTon = response[0].SoLuongTon;
        this.listDetailProductImg = []
        response.forEach((data: any) => {
          this.listDetailProductImg.push(data.DuongDan)
        })
        this.selectedImagePath = 'http://localhost:8000/' + this.listDetailProductImg[0]

        let data = {
          proid: response[0].MaSanPham,
          colorid: response[0].MaMau
        }
        this.http.post("http://localhost:8000/user/product/datasize", data).subscribe((response: any) => {
          if (response) {
            this.datasizebyproid = response
            this.selectedSize = response[0].MaKichThuoc
            this.dataCart = this.datasizebyproid[0]
          }
        }, (error) => {
          console.error(error);
        })
      }
    }, (error) => {
      console.error(error);
    })
  }

  activateTab(event: any, nb: number) {
    event.preventDefault()
    this.activeTabIndex = nb
    const urlWithParams = this.router.createUrlTree([], { queryParams: { status: nb } }).toString();
    this.router.navigateByUrl(urlWithParams);
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
          this.detailproductQuickView = response;
          this.dataCartQuickview = this.detailproductQuickView[0];
          this.SoLuongTonXemNhanh = this.detailproductQuickView[0].SoLuongTon;
          this.selectedImagePathQuickView = 'http://localhost:8000/' + this.detailproductQuickView[0].DuongDan
          this.listDetailProductImgQuickView = []
          this.detailproductQuickView.forEach((data: any) => {
            this.listDetailProductImgQuickView.push(data.DuongDan)
          })
        }
      }, (error) => {
        console.error(error);
      })

      this.http.get("http://localhost:8000/user/product/datacolor/" + id).subscribe((response: any) => {
        if (response) {
          this.datacolorquickviewbyproid = response;
        }
      }, (error) => {
        console.error(error);
      })

      this.http.get("http://localhost:8000/user/product/dataproductbyid/" + id).subscribe((response: any) => {
        if (response) {
          this.dataquickviebyproductid = response;
        }
      }, (error) => {
        console.error(error);
      })

      this.http.post("http://localhost:8000/user/product/datasize", params).subscribe((response: any) => {
        if (response) {
          this.datasizequickviewbyproid = response
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

  addCartDetail(data: any) {
    this.quanticart = this.quantityCartDetail;
    if (this.customer == null) {
      this.toastmsg.showToast({
        title: "Bạn chưa đăng nhập",
        message: "Vui lòng đăng nhập để thêm vào giỏ",
        type: "warning"
      })
    }else{
      if (this.quanticart > this.SoLuongTon) {
        this.toastmsg.showToast({
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
  
        this.toastmsg.showToast({
          title: 'Thành công',
          message: 'Thêm vào giỏ hàng thành công',
          type: 'success',
          duration: 3000
        });
      }
    }
    
  }

  addcartquickviewdetail(data: any) {
    if (this.cartInput) {
      this.quanticart = this.cartInput.nativeElement.value;
      if (this.quanticart > this.SoLuongTonXemNhanh) {
        this.toastmsg.showToast({
          title: "Có lỗi xảy ra",
          message: "Số lượng trong kho không đủ chỉ còn: " + this.SoLuongTonXemNhanh + " sản phẩm",
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

        this.toastmsg.showToast({
          title: 'Thành công',
          message: 'Thêm vào giỏ hàng thành công',
          type: 'success',
          duration: 3000
        });
      }
    }
  }

  onChangeSizeQuickView(event: any) {
    let sizeid = event.target.value;

    const data = this.dataquickviebyproductid.find((item: any) => item.MaKichThuoc === Number(sizeid));

    let params = {
      proid: data.MaSanPham,
      colorid: data.MaMau,
      sizeid: sizeid
    }

    this.http.post("http://localhost:8000/user/product/dataquantyofsize", params).subscribe((response: any) => {
      if (response) {
        // this.datasizebyproid = response
        this.SoLuongTonXemNhanh = response[0].SoLuongTon;
        this.dataCartQuickview = response[0]
      }
    }, (error) => {
      console.error(error);
    })
  }

  onChangeColorQuickView(event: any) {
    let colorid = event.target.value;
    const data = this.datacolorquickviewbyproid.find((item: any) => item.MaMau === Number(colorid));
    let params = {
      detailproid: data.MaChiTietSanPham,
      colorid: colorid
    }
    this.http.post("http://localhost:8000/user/product/getimgbycolorid", params).subscribe((response: any) => {
      console.log(response);
      if (response) {

        this.SoLuongTonXemNhanh = response[0].SoLuongTon;
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
            this.datasizequickviewbyproid = response
            this.dataCartQuickview = this.datasizequickviewbyproid[0]
          }
        }, (error) => {
          console.error(error);
        })
      }
    }, (error) => {
      console.error(error);
    })
  }

  selectImageQuickView(index: any) {
    this.selectedImagePathQuickView = 'http://localhost:8000/' + this.listDetailProductImgQuickView[index]
    this.selectedImageIndexQuickview = index

    document.querySelectorAll(".slick-slide").forEach((el) => {
      el.classList.remove('active')
    })

    document.querySelectorAll(".slick-slide")[index].classList.add("active")
  }

  addcart(item: any) {
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
    this.toastmsg.showToast({
      title: 'Thành công',
      message: 'Thêm vào giỏ hàng thành công',
      type: 'success',
      duration: 3000
    });

  }
}
