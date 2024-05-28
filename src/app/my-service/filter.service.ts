import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  constructor() { }

  encodeFilters(filters: any): string {
    const json = JSON.stringify(filters);
    return btoa(json);
  }

  decodeFilters(encodedFilters: string): any {
    const json = atob(encodedFilters);
    return JSON.parse(json);
  }
}
