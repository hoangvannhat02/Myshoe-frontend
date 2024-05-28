export class carts{
    ProductID:number;
    ProductName: string;
    ProductPrice: number;
    ProductPath: string;
    Quantity: number;
    UserID: number;
    ColorID:number;
    ColorName:string;
    SizeID:number;
    SizeName:string;

    constructor(id:number,name:string,price:number,path:string,quantity:number,userid:number,colorid:any,colorname:string,sizeid:any,sizename:any){
        this.ProductID = id;
        this.ProductName = name;
        this.ProductPrice = price;
        this.ProductPath = path;
        this.Quantity = quantity;
        this.UserID = userid;
        this.ColorID = colorid;
        this.ColorName = colorname;
        this.SizeID = sizeid;
        this.SizeName = sizename;
    }
}