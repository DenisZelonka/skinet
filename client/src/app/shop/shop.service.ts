import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { enviroment } from 'src/environments/environment';
import { Brand } from '../shared/models/brand';
import { Pagination } from '../shared/models/pagination';
import { Product } from '../shared/models/product';
import { Type } from '../shared/models/productType';
import { ShopParams } from '../shared/models/shopParams';

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  baseUrl=enviroment.apiUrl;


  constructor(private http:HttpClient) {
   }

   getProducts(shopParams:ShopParams) {
    let params= new HttpParams();

    if (shopParams.brandId !== 0) {
      params=params.append('brandId',shopParams.brandId.toString());
    }

    if (shopParams.typeId !==0){
      params=params.append('typeId',shopParams.typeId.toString());
    }
    if (shopParams.search) {
      params=params.append('search',shopParams.search);
    }
    
    params=params.append('sort',shopParams.sort);
    params=params.append('pageIndex',shopParams.pageNumber.toString());
    params=params.append('pageIndex',shopParams.pageSize.toString());

    return this.http.get<Pagination<Product[]>>(this.baseUrl + 'products', {observe: 'response',params})
      .pipe(
        map(response => {
          return response.body;
        })
      );
   }

   getProduct(id: number){
    return this.http.get<Product>(this.baseUrl + 'products/'+ id);
   }

   getBrands() {
    return this.http.get<Brand[]>(this.baseUrl + 'products/brands');
   }

   getTypes() {
    return this.http.get<Type[]>(this.baseUrl + 'products/types');
   }


}
