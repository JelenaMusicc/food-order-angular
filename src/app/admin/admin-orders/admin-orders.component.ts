import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderService } from 'src/app/order.service';

@Component({
  selector: 'app-admin-orders',
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.css']
})
export class AdminOrdersComponent implements OnInit {

  orders$;
  
  constructor(private orderService: OrderService) {
    this.orders$ = this.orderService.getOrders();
   }

  ngOnInit(): void {
  }

}
