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
  private pollingTimeout: any; 
  private apiUrl = 'http://44.198.101.165:7070/api/delivery'; 
  public delivered: boolean = false;
  private maxPollingTime = 10000;  
  private pollingStartTime: number = 0; 

  constructor(private http: HttpClient) {}

  ngOnInit() {
    if (this.orderId) {
      this.startDelivery();
    }
  }

  ngOnDestroy() {
    clearInterval(this.pollingInterval);
    clearTimeout(this.pollingTimeout); 
  }

  startPolling() {
    setTimeout(() => {
      console.log("Iniciando polling...");
      this.pollingStartTime = Date.now();
      this.pollingInterval = setInterval(() => {
        this.checkOrderStatus();
      }, 5000);

      this.pollingTimeout = setTimeout(() => {
        console.log("Tiempo de polling agotado. Deteniendo polling.");
        this.stopPolling();
      }, this.maxPollingTime);
    }, 5000); 
  }

  stopPolling() {
    clearInterval(this.pollingInterval);
    clearTimeout(this.pollingTimeout);
    this.pollingInterval = null;
  }

  checkOrderStatus() {
    console.log('Checking order status...');
    if (!this.delivered) {
      this.http.get<{ ID: number, Alert: string }>(this.apiUrl, { observe: 'response' }).subscribe(response => {
        if (response.status === 204) {
          console.log('No hay alertas nuevas.');
          return;
        }

        if (response.body && response.body.ID === this.orderId) {
          console.log('Orden entregada:', response.body);
          this.statusMessage = '¡Entregada!';
          this.gifUrl = 'entregado.gif';
          this.delivered = true;
          this.stopPolling(); 
        }
      }, error => {
        console.error('API Error:', error);
      });
    }
  }

  resetStatus() {
    this.statusMessage = 'Esperando pedido...';
    this.gifUrl = 'repartidor.gif'; 
    this.delivered = false;
    this.startPolling(); 
  }

  startDelivery() {
    this.statusMessage = 'En camino...';
    this.gifUrl = 'repartidor.gif';  
    this.startPolling(); 
  }
}
