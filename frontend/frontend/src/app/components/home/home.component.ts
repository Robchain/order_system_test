// src/app/components/home/home.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, MatIconModule],
  template: `
    <div style="padding: 40px; text-align: center;">
      <mat-card>
        <h1>AFECOR - Sistema de Pedidos</h1>
        <p>Angular funcionando correctamente</p>
        
        <div *ngIf="apiStatus">
          <p><strong>Estado API:</strong> {{ apiStatus }}</p>
        </div>
        
        <button mat-raised-button color="primary" (click)="testBackend()">
          Probar Conexión Backend
        </button>

        <button mat-raised-button color="accent" (click)="goToPedidos()" style="margin-left: 10px;">
            Ver Lista de Pedidos
            </button>
        
        <div *ngIf="productos.length > 0" style="margin-top: 20px;">
          <h3>Productos desde el Backend:</h3>
          <ul>
            <li *ngFor="let producto of productos">
              {{ producto.nombre }} - {{ producto.precioVenta | currency:'USD' }}
            </li>
          </ul>
        </div>
      </mat-card>
    </div>
  `
})
export class HomeComponent implements OnInit {
  apiStatus = '';
  productos: any[] = [];

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit() {
    this.testBackend();
  }

  goToPedidos() {
    this.router.navigate(['/pedidos']);
  }

  testBackend() {
    this.apiStatus = 'Conectando...';
    
    this.apiService.testApi().subscribe({
      next: (data: any) => {
        this.apiStatus = 'Conectado exitosamente';
        this.productos = data;
        console.log('Datos del backend:', data);
      },
      error: (error) => {
        this.apiStatus = 'Error de conexión: ' + error.message;
        console.error('Error conectando con backend:', error);
      }
    });
  }
}