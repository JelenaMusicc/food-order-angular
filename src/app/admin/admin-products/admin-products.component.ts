import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Product } from 'src/app/models/product';
import { ProductService } from 'src/app/product.service';

@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css']
})
export class AdminProductsComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  filteredProducts: any[] = [];
  subscription: Subscription;
  

  constructor(private productService: ProductService) {

    this.subscription = this.productService.getAll().subscribe((products) =>
      this.filteredProducts = this.products = products);
  }
  

  filter(query: string){
    if(query){
      this.filteredProducts = this.products.filter(p => p.title && p.title.toLowerCase().includes(query.toLowerCase()));
    }else{
      this.filteredProducts = this.products;
    }
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  ngOnInit(){

  }


}
