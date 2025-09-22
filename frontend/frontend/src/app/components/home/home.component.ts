// src/app/components/home/home.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule
  ],
  template: `
    <div class="home-container">
      <mat-card class="welcome-card">
        <mat-card-header>
          <mat-card-title>
            <mat-icon>agriculture</mat-icon>
            Bienvenido a AFECOR
          </mat-card-title>
        </mat-card-header>
        
        <mat-card-content>
          <p>Sistema de gestión de pedidos para productos agroquímicos</p>
          
          <div class="actions">
            <button mat-raised-button color="primary" (click)="goToPedidos()">
              <mat-icon>list</mat-icon>
              Ver Pedidos
            </button>
            
            <button mat-raised-button color="accent" (click)="createPedido()">
              <mat-icon>add</mat-icon>
              Nuevo Pedido
            </button>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Status del Backend -->
      <mat-card class="status-card">
        <mat-card-content>
          <h3>Estado del Sistema</h3>
          <div class="status-item">
            <mat-icon color="primary">api</mat-icon>
            <span>Backend API: 
              <strong style="color: green;">✅ Funcionando</strong>
            </span>
          </div>
          <div class="status-item">
            <mat-icon color="primary">storage</mat-icon>
            <span>Base de Datos: 
              <strong style="color: green;">✅ Conectada</strong>
            </span>
          </div>
          <p class="api-info">
            <small>API: http://localhost:5254/api</small>
          </p>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .home-container {
      padding: 40px 20px;
      max-width: 800px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 30px;
    }

    .welcome-card {
      text-align: center;
    }

    .welcome-card mat-card-title {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      font-size: 2rem;
      color: #2c3e50;
    }

    .welcome-card mat-card-content {
      padding: 30px;
    }

    .welcome-card p {
      font-size: 1.2rem;
      color: #7f8c8d;
      margin-bottom: 30px;
    }

    .actions {
      display: flex;
      gap: 20px;
      justify-content: center;
      flex-wrap: wrap;
    }

    .actions button {
      min-width: 150px;
      height: 50px;
      font-size: 1.1rem;
    }

    .status-card h3 {
      color: #2c3e50;
      margin-bottom: 20px;
    }

    .status-item {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 15px;
    }

    .api-info {
      margin-top: 20px;
      text-align: center;
      color: #95a5a6;
    }

    @media (max-width: 600px) {
      .home-container {
        padding: 20px 10px;
      }
      
      .actions {
        flex-direction: column;
        align-items: center;
      }
      
      .actions button {
        width: 100%;
        max-width: 300px;
      }
    }
  `]
})
export class HomeComponent {
  constructor(private router: Router) {}

  goToPedidos(): void {
    this.router.navigate(['/pedidos']);
  }

  createPedido(): void {
    this.router.navigate(['/pedidos/nuevo']);
  }
}