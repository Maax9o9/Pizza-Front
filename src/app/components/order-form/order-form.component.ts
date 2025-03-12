import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card'; 
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { OrderStatusComponent } from '../order-status/order-status.component';

@Component({
  selector: 'app-order-form',
  standalone: true,
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.scss'],
  imports: [CommonModule, 
            MatCardModule,
            MatFormFieldModule,
            ReactiveFormsModule,
            MatInputModule,
            OrderStatusComponent]
})

export class OrderFormComponent {
  orderForm: FormGroup;
  static orderIdCounter: number = 1; 
  orderId: number;
  apiUrl: string = 'http://35.171.234.157:8080/order';
  orderSubmitted = false;
  orderStatusUpdated = false;

  constructor(private fb: FormBuilder, private snackBar: MatSnackBar, private http: HttpClient) {
    this.orderId = OrderFormComponent.orderIdCounter++;
    this.orderForm = this.fb.group({
      orderItems: ['', Validators.required],
      total: ['', [Validators.required, Validators.min(0.01)]]
    });
  }

  submitOrder() {
    if (this.orderForm.valid) {
      const order = {
        ID: this.orderId,
        OrderItems: this.orderForm.value.orderItems,
        Total: this.orderForm.value.total
      };

      this.http.post(this.apiUrl, order).subscribe(
        response => {
          this.showAlert(`Orden enviada con éxito: ${JSON.stringify(response)}`);
          this.orderSubmitted = true;
          this.updateOrderStatus();
        },
        error => {
          this.showAlert('Error al enviar la orden');
        }
      );
    }
  }

  updateOrderStatus() {
    this.orderStatusUpdated = true;
  }

  showAlert(message: string) {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      verticalPosition: 'top',
      horizontalPosition: 'center'
    });
  }
}
