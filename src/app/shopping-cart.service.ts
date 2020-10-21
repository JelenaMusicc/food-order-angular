import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/database';
import { Product } from './models/product';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs';
import { map, take } from "rxjs/operators";




import { ShoppingCart } from './models/shopping-cart';
import { ShoppingCartItem } from './models/shopping-cart-item';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {

  constructor(private db: AngularFireDatabase) { }

  private create() {
    return this.db.list('/shopping-carts').push({
      dateCreated: new Date().getTime()
    });
  }
  async getCart(): Promise<Observable<ShoppingCart>> {
    let cartId = await this.getOrCreateCartId();
    return this.db.object<ShoppingCart>('/shopping-carts/' + cartId).snapshotChanges()
      .pipe(map((items) => new ShoppingCart(items.payload.child('/items').val())))
  }

  private async getOrCreateCartId(): Promise<string> {
    let cartId = localStorage.getItem('cartId');
    if (cartId) {
      return cartId;
    }
    let result = await this.create();
    localStorage.setItem('cartId', result.key);
    return result.key;
  }
  async addToCart(product: Product) {
    this.updateItem(product, 1);
  }
  async removeFromCart(product: Product) {
    this.updateItem(product, -1);
  }
  async clearCart() {
    let cartId = await this.getOrCreateCartId();
    this.db.object('/shopping-carts/' + cartId + '/items').remove();
  }

  private getItem(cartId: string, productId: string) {
    return this.db.object('/shopping-carts/' + cartId + '/items/' + productId);
  }

  private async updateItem(product: Product, change: number) {
    const cartId = await this.getOrCreateCartId();
    const item = this.getItem(cartId, product.key);

    item.valueChanges().pipe(take(1)).subscribe((data: ShoppingCartItem) => {
        const quantity = (data ? (data.quantity || 0) : 0) + change; 
        if (!quantity) {
          item.remove();
        }
        else {
          item.update({
            title: product.title,
            imageUrl: product.imageUrl,
            price: product.price,
            quantity
          });
        }
      });
  }

}
