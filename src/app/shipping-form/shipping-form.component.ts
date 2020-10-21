import { Input } from '@angular/core';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';
import { Order } from '../models/order';
import { ShoppingCart } from '../models/shopping-cart';
import { OrderService } from '../order.service';

@Component({
  selector: 'app-shipping-form',
  templateUrl: './shipping-form.component.html',
  styleUrls: ['./shipping-form.component.css']
})
export class ShippingFormComponent implements OnInit, OnDestroy {
 
  @Input('cart') cart: ShoppingCart;
  shipping: any = {};
  userId: string;
  subscription: Subscription;

  constructor(
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router) { }

  ngOnInit() {
    this.subscription = this.authService.user$.subscribe(user => this.userId = user.uid);
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  async placeOrder() {
    let order = new Order(this.userId, this.shipping, this.cart);
    let result = await this.orderService.placeOrder(order);
    this.router.navigate(['/order-success', result.key]);


  }

}
