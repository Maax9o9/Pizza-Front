import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-status',
  standalone: true,
  templateUrl: './order-status.component.html',
  styleUrls: ['./order-status.component.scss'],
  imports: [CommonModule]
})
export class OrderStatusComponent implements OnInit, OnDestroy {
  @Input() orderId!: number;
  statusMessage: string = 'Esperando pedido...';
  gifUrl: string = 'repartidor.gif'; 
  private pollingInterval: any;
  private apiUrl = 'http://localhost:7070/api/delivery';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.startPolling();
  }

  ngOnDestroy() {
    clearInterval(this.pollingInterval);
  }

  startPolling() {
    this.pollingInterval = setInterval(() => {
      this.checkOrderStatus();
    }, 5000); 
  }

  checkOrderStatus() {
    this.http.get<{ status: string }>(this.apiUrl).subscribe(response => {
      if (response.status === 'delivered') {
        this.statusMessage = '¡Entregada!';
        this.gifUrl = 'entregado.gif'; 
        clearInterval(this.pollingInterval);
      }
    });
  }

  startDelivery() {
    this.statusMessage = 'En camino...';
    this.gifUrl = 'repartidor.gif'; 
  }
}