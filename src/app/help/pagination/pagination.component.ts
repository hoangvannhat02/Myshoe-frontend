import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnChanges{
  @Input() currentPage!: number;
  @Input() itemsPerPage!: number;
  @Input() totalItems!: number;
  @Output() pageChange: EventEmitter<number> = new EventEmitter();

  totalPages!: number;
  displayedPages: number[] = [];

  constructor() { 
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('currentPage' in changes || 'itemsPerPage' in changes || 'totalItems' in changes || 'values' in changes) {
      this.updatePagination();
    }
  }

  updatePagination(){
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    this.updateDisplayedPages();
  }

  updateDisplayedPages(): void {
    const maxDisplayedPages = 3;
    const halfMaxDisplayedPages = Math.floor(maxDisplayedPages / 2);
    const startPage = Math.max(1, this.currentPage - halfMaxDisplayedPages);
    const endPage = Math.min(this.totalPages, startPage + maxDisplayedPages - 1);

    this.displayedPages = [];
    for (let i = startPage; i <= endPage; i++) {
      this.displayedPages.push(i);
    } 
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.pageChange.emit(this.currentPage+1);
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.pageChange.emit(this.currentPage-1);
    }
  }

  goToFirstPage(): void {
    if (this.currentPage !== 1) {
      this.pageChange.emit(1);
    }
  }
  
  goToLastPage(): void {
    if (this.currentPage !== this.totalPages) {
      this.pageChange.emit(this.totalPages);
    }
  }

  onPageChange(page: number): void {
    // this.currentPage = page;
    // this.updateDisplayedPages()
    // const arr:any = []
    // const getPoint = this.calculateStartAndEndIndex(this.itemsPerPage,this.totalItems,this.currentPage)
    // for(let i = getPoint.startPoint;i<=getPoint.endPoint;i++){
    //   arr.push(this.values[i])
    // }
    // console.log(arr);
    
  }

  // calculateStartAndEndIndex(pagesize:any,totalitems:any,page:any){
  //   const startPoint = (page - 1) * pagesize
  //   const endPoint = Math.min(page*pagesize,totalitems)-1
  //   return { startPoint,endPoint }
  // }
}
