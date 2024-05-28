import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FilterService } from 'src/app/my-service/filter.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css'
  ]
})
export class CategoryComponent {
  id: any;
  products: any[] = [];
  backproducts: any[] = []

  colors: any[] = []
  sizes: any[] = []
  brands: any[] = []

  fillters: any = {
    brands: [],
    colors: [],
    sizes: [],
    rangeprice: []
  }

  // pagination
  currentPage:number = 1
  itemsPerPage:number = 2
  dataproductsbypagination:any;


  filteredProducts: any[] = []

  categoryproducts: any[] = [];

  filltername = "Mặc định"

  sellingproduct: any = []; // Danh sách sản phẩm bán chạy
  displayedProducts: number = 2;

  isRotated: boolean[] = [false, false, false, false]

  // true = view gird, false = view list
  view: boolean = true

  searchkey: string = ""
  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private fillterservice: FilterService
  ) { };

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.searchkey = params['query'];
      const view = params['view']
      const id = this.route.snapshot.paramMap.get('id') ?? null;
      const encodedFilters = params['filters'];

      const currentURL = this.router.url;      
      if(currentURL === '/category'){
        this.getdata()
      }
      if (currentURL.includes('/category') && encodedFilters) {
        this.fillters = this.fillterservice.decodeFilters(encodedFilters);
        this.getdata()
      }

      if (encodedFilters) {
        this.fillters = this.fillterservice.decodeFilters(encodedFilters);
      }
      if (this.searchkey) {
        this.getdataproduct();
      }

      if (this.searchkey && view) {
        this.view = JSON.parse(view)
        this.getdataproduct();
      }
      if (view) {
        this.view = JSON.parse(view)
      }

      if (view && Number(id) > 0) {
        this.view = JSON.parse(view)
        this.id = Number(id);
        this.getdatabyid(this.id);
      }
      if (Number(id) > 0) {
        this.id = Number(id);
        this.getdatabyid(this.id);
      }
    });


    this.getsize()
    this.getcolor()
    this.getbrand()
    this.getdatacategory()
    this.getsellingproduct()
  }
  getdatabyid(id: any) {
    this.products = []
    this.http.get("http://localhost:8000/user/product/databycateid/" + id).subscribe((response: any) => {
      if (response) {
        this.products = response;
        this.backproducts = [...response]
        this.onPageChange(1)
        if (this.fillters.colors.length > 0 || this.fillters.brands.length > 0 || this.fillters.sizes.length > 0 || this.fillters.rangeprice.length > 0) {
          this.filterProducts()
        }
      }
    }, (error) => {
      console.error(error);
    })
  }

  getdataproduct() {
    this.products = []
    this.http.get("http://localhost:8000/user/product/data").subscribe((response: any) => {
      if (response) {
        const data = response.filter((x: any) => x.TenHang.toLowerCase().includes(this.searchkey.toLowerCase())
          || x.TenSanPham.toLowerCase().includes(this.searchkey.toLowerCase()));
        this.products = data
        this.backproducts = [...data]
        this.onPageChange(1)
        if (this.fillters.colors.length > 0 || this.fillters.brands.length > 0 || this.fillters.sizes.length > 0 || this.fillters.rangeprice.length > 0) {
          this.filterProducts()
        }
      }
    }, (error) => {
      console.error(error);
    })
  }

  getdata() {
    this.products = []
    this.http.get("http://localhost:8000/user/product/data").subscribe((response: any) => {
      if (response) {
        this.products = response
        this.backproducts = [...response]
        this.onPageChange(1)
        if (this.fillters.colors.length > 0 || this.fillters.brands.length > 0 || this.fillters.sizes.length > 0 || this.fillters.rangeprice.length > 0) {
          this.filterProducts()
        }
      }
    }, (error) => {
      console.error(error);
    })
  }

  getcolor() {
    this.http.get("http://localhost:8000/user/color/data").subscribe((response: any) => {
      if (response) {
        this.colors = response
        console.log(this.colors);

      }
    }, (error) => {
      console.error(error);
    })
  }

  getbrand() {
    this.http.get("http://localhost:8000/user/brand/data").subscribe((response: any) => {
      if (response) {
        this.brands = response
        console.log(this.brands);

      }
    }, (error) => {
      console.error(error);
    })
  }

  getsize() {
    this.http.get("http://localhost:8000/user/size/data").subscribe((response: any) => {
      if (response) {
        this.sizes = response
        console.log(this.sizes);

      }
    }, (error) => {
      console.error(error);
    })
  }

  changecate(id: any) {
    this.http.get("http://localhost:8000/user/product/databycateid/" + id).subscribe((response: any) => {
      this.router.navigate(["/category/", id])
      this.id = Number(id)
      this.products = response;
      this.backproducts = this.products
      if (this.fillters.colors.length > 0 || this.fillters.brands.length > 0 || this.fillters.sizes.length > 0 || this.fillters.rangeprice.length > 0) {

        this.fillters = {
          brands: [],
          colors: [],
          sizes: [],
          rangeprice: []
        }
      }
    }, (error) => {
      console.error(error);
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

  changeview(data: boolean) {
    this.view = data
    this.router.navigate([], { queryParams: { view: data }, queryParamsHandling: 'merge' })
  }

  sortdata(style: string, event: any) {
    event.preventDefault()
    let name = event.target.innerText
    this.filltername = name
    if (style.includes('default')) {
      this.products = this.backproducts
      this.onPageChange(1)
    }
    if (style.includes('nameaz')) {
      this.products.sort((a, b) => {
        if (a.TenSanPham < b.TenSanPham) return -1;
        if (a.TenSanPham > b.TenSanPham) return 1;
        return 0;
      });
    }

    if (style.includes('nameza')) {
      this.products.sort((a, b) => {
        if (a.TenSanPham < b.TenSanPham) return 1;
        if (a.TenSanPham > b.TenSanPham) return -1;
        return 0;
      });
    }

    if (style.includes('priceascending')) {
      this.products.sort((a, b) => {
        if (a.GiaKhuyenMai < b.GiaKhuyenMai) return 1;
        if (a.GiaKhuyenMai > b.GiaKhuyenMai) return -1;
        return 0;
      });
    }

    if (style.includes('pricedecending')) {
      this.products.sort((a, b) => {
        if (a.GiaKhuyenMai < b.GiaKhuyenMai) return -1;
        if (a.GiaKhuyenMai > b.GiaKhuyenMai) return 1;
        return 0;
      });
    }

    if (style.includes('new')) {
      this.products.sort((a, b) => {
        if (a.MaChiTietSanPham < b.MaChiTietSanPham) return 1;
        if (a.MaChiTietSanPham > b.MaChiTietSanPham) return -1;
        return 0;
      });
    }
  }

  getsellingproduct(): void {
    this.http.get("http://localhost:8000/user/billofsale/sellingproduct").subscribe((respone: any) => {
      if (respone) {
        this.sellingproduct = respone
      }
    })
  }

  showMoreSellingProducts(event: any, length: number) {
    event.preventDefault()
    if (this.sellingproduct.layout > length) {
      this.displayedProducts
    }
    this.displayedProducts = length
  }

  redirectodetail(id: number) {
    this.router.navigate(['/detail', id])
    window.scrollTo(0, 0)
  }

  toggleRotateClass(i: any) {
    this.isRotated[i] = !this.isRotated[i];
  }

  clickcheckbox(event: any, min: any, max: any) {
    if (event.target.checked) {
      const check = this.fillters.rangeprice.some((x: any) => x.min === min && x.max === max);
      if (!check) {
        this.fillters.rangeprice.push({ min: min, max: max });
        this.updateFilters()
      }
    } else {
      const index = this.fillters.rangeprice.findIndex((x: any) => x.min === min && x.max === max);
      if (index !== -1) {
        this.fillters.rangeprice.splice(index, 1);
        this.updateFilters()
      }
    }
  }

  isCheckedBrand(item: any): boolean {
    if (!this.fillters.brands.some((x: any) => x === item)) {
      return false
    }
    return true
  }

  isCheckedColor(item: any): boolean {
    if (!this.fillters.colors.some((x: any) => x === item)) {
      return false
    }
    return true
  }
  isCheckedSize(item: any): boolean {
    if (!this.fillters.sizes.some((x: any) => x === item)) {
      return false
    }
    return true
  }
  isCheckedRangePrice(min: any, max: any): boolean {
    if (!this.fillters.rangeprice.some((x: any) => x.min === min && x.max === max)) {
      return false
    }
    return true
  }

  clickcheckboxsize(event: any, ma: any) {
    if (event.target.checked) {
      const check = this.fillters.sizes.some((x: any) => x === ma)
      if (!check) {
        this.fillters.sizes.push(ma)
        this.updateFilters()
      }
    } else {
      const index = this.fillters.sizes.findIndex((x: any) => x === ma);
      if (index !== -1) {
        this.fillters.sizes.splice(index, 1);
        this.updateFilters()
      }
    }

  }

  clickcheckboxbrand(event: any, ma: any) {
    if (event.target.checked) {
      const check = this.fillters.brands.some((x: any) => x === ma)
      if (!check) {
        this.fillters.brands.push(ma)
        this.updateFilters()
      }
    } else {
      const index = this.fillters.brands.findIndex((x: any) => x === ma);
      if (index !== -1) {
        this.fillters.brands.splice(index, 1);
        this.updateFilters()
      }
    }


  }

  clickcheckboxcolor(event: any, ma: any) {
    if (event.target.checked) {
      const check = this.fillters.colors.some((x: any) => x === ma)
      if (!check) {
        this.fillters.colors.push(ma)
        this.updateFilters()
      }
    } else {
      const index = this.fillters.colors.findIndex((x: any) => x === ma);
      if (index !== -1) {
        this.fillters.colors.splice(index, 1);
        this.updateFilters()
      }
    }
  }

  updateFilters() {
    const encodedFilters = this.fillterservice.encodeFilters(this.fillters);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        filters: encodedFilters
      },
      queryParamsHandling: 'merge'
    });
  }

  filterProducts() {
    this.filteredProducts = this.backproducts.filter(product => {
      if (this.fillters.brands.includes(product.MaHang)) return true;

      if (this.fillters.colors.includes(product.MaMau)) return true;

      if (this.fillters.sizes.includes(product.MaKichThuoc)) return true;

      if (this.fillters.rangeprice.some((range: any) =>
        product.GiaKhuyenMai >= range.min && product.GiaKhuyenMai <= range.max
      )) return true;

      return false;
    });
    this.backproducts = this.filteredProducts
    this.products = this.filteredProducts
    this.onPageChange(1)
  }

  onPageChange(page:any):void{
    this.currentPage = page;
    // Lưu dữ liệu đã phân theo trang vào mảng mới
    const arr:any = []
    const getPoint = this.calculateStartAndEndIndex(this.itemsPerPage,this.backproducts.length,this.currentPage)
    for(let i = getPoint.startPoint;i<=getPoint.endPoint;i++){
      arr.push(this.backproducts[i])
    }
    this.products = arr
  }

  calculateStartAndEndIndex(pagesize:any,totalitems:any,page:any){
    const startPoint = (page - 1) * pagesize
    const endPoint = Math.min(page*pagesize,totalitems)-1
    return { startPoint,endPoint }
  }

  changeoptionshow(item:any){
    this.itemsPerPage = Number(item)
    this.onPageChange(1)
  }

  solvediscount(originalPrice: number, discountedPrice: number): number {
    return Math.ceil((originalPrice - discountedPrice) / originalPrice * 100);
  }
}
