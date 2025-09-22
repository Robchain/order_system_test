import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';


@Component({
  selector: 'app-pedidos-list',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="pedidos-container">
      <!-- Header -->
      <div class="header">
        <h1>Lista de Pedidos</h1>
        <button mat-raised-button color="primary" (click)="crearPedido()">
          <mat-icon>add</mat-icon>
          Nuevo Pedido
        </button>
      </div>

      <!-- Loading -->
      <div *ngIf="loading" class="loading">
        <mat-spinner diameter="50"></mat-spinner>
        <p>Cargando pedidos...</p>
      </div>

      <!-- Error -->
      <div *ngIf="error" class="error">
        <mat-icon>error</mat-icon>
        <p>{{ error }}</p>
        <button mat-button color="primary" (click)="loadPedidos()">
          <mat-icon>refresh</mat-icon>
          Reintentar
        </button>
      </div>

      <!-- No hay pedidos -->
      <div *ngIf="!loading && !error && pedidos.length === 0" class="no-data">
        <mat-icon>assignment</mat-icon>
        <h3>No hay pedidos registrados</h3>
        <p>Comienza creando tu primer pedido</p>
        <button mat-raised-button color="primary" (click)="crearPedido()">
          <mat-icon>add</mat-icon>
          Crear Primer Pedido
        </button>
      </div>

      <!-- Lista de pedidos -->
      <div *ngIf="!loading && !error && pedidos.length > 0" class="pedidos-grid">
        <mat-card *ngFor="let pedido of pedidos" class="pedido-card">
          <mat-card-header>
            <mat-card-title>
              Pedido #{{ pedido.pedidoId }}
              <span class="indicador" [class]="getRentabilidadClass(pedido.indicadorRentabilidad)">
                {{ pedido.indicadorRentabilidad }}
              </span>
            </mat-card-title>
            <mat-card-subtitle>{{ pedido.clienteNombre }}</mat-card-subtitle>
          </mat-card-header>

          <mat-card-content>
            <div class="pedido-info">
              <div class="info-item">
                <mat-icon>event</mat-icon>
                <span>{{ formatearFecha(pedido.fecha) }}</span>
              </div>
              <div class="info-item">
                <mat-icon>attach_money</mat-icon>
                <span>{{ formatearMoneda(pedido.total) }}</span>
              </div>
              <div class="info-item">
                <mat-icon>trending_up</mat-icon>
                <span>{{ pedido.rentabilidadPromedio.toFixed(1) }}%</span>
              </div>
              <div class="info-item">
                <mat-icon>info</mat-icon>
                <span class="estado" [class]="'estado-' + pedido.estado.toLowerCase()">
                  {{ pedido.estado }}
                </span>
              </div>
            </div>
          </mat-card-content>

          <mat-card-actions>
            <button mat-button color="primary" (click)="verPedido(pedido.pedidoId)">
              <mat-icon>visibility</mat-icon>
              Ver
            </button>
            <button mat-button color="accent" (click)="editarPedido(pedido.pedidoId)">
              <mat-icon>edit</mat-icon>
              Editar
            </button>
            <button mat-button color="warn" (click)="eliminarPedido(pedido)">
              <mat-icon>delete</mat-icon>
              Eliminar
            </button>
          </mat-card-actions>
        </mat-card>
      </div>

      <!-- Resumen -->
      <div *ngIf="pedidos.length > 0" class="resumen">
        <mat-card>
          <mat-card-content>
            <h3>Resumen</h3>
            <div class="stats">
              <div class="stat">
                <span class="label">Total Pedidos:</span>
                <span class="value">{{ pedidos.length }}</span>
              </div>
              <div class="stat">
                <span class="label">Valor Total:</span>
                <span class="value">{{ formatearMoneda(getTotalValue()) }}</span>
              </div>
              <div class="stat">
                <span class="label">Rentabilidad Promedio:</span>
                <span class="value">{{ getAverageRentability().toFixed(1) }}%</span>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .pedidos-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
    }

    .header h1 {
      margin: 0;
      color: #2c3e50;
    }

    .loading, .error, .no-data {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px 20px;
      text-align: center;
    }

    .loading mat-spinner {
      margin-bottom: 20px;
    }

    .error mat-icon, .no-data mat-icon {
      font-size: 4rem;
      width: 4rem;
      height: 4rem;
      margin-bottom: 20px;
      color: #95a5a6;
    }

    .pedidos-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }

    .pedido-card {
      position: relative;
    }

    .pedido-card mat-card-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .indicador {
      padding: 4px 12px;
      border-radius: 15px;
      font-size: 0.8rem;
      font-weight: 600;
      text-transform: uppercase;
    }

    .rentabilidad-verde {
      background-color: #d4edda;
      color: #155724;
    }

    .rentabilidad-amarillo {
      background-color: #fff3cd;
      color: #856404;
    }

    .rentabilidad-rojo {
      background-color: #f8d7da;
      color: #721c24;
    }

    .pedido-info {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .info-item {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .info-item mat-icon {
      color: #666;
      font-size: 1.2rem;
      width: 1.2rem;
      height: 1.2rem;
    }

    .estado {
      padding: 2px 8px;
      border-radius: 10px;
      font-size: 0.8rem;
      font-weight: 500;
    }

    .estado-pendiente {
      background-color: #fff3cd;
      color: #856404;
    }

    .estado-procesando {
      background-color: #cce5ff;
      color: #004085;
    }

    .estado-completado {
      background-color: #d4edda;
      color: #155724;
    }

    .estado-cancelado {
      background-color: #f8d7da;
      color: #721c24;
    }

    .resumen {
      margin-top: 30px;
    }

    .resumen h3 {
      color: #2c3e50;
      margin-bottom: 20px;
    }

    .stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
    }

    .stat {
      display: flex;
      justify-content: space-between;
      padding: 15px;
      background-color: #f8f9fa;
      border-radius: 8px;
    }

    .stat .label {
      font-weight: 500;
      color: #666;
    }

    .stat .value {
      font-weight: 600;
      color: #2c3e50;
    }

    @media (max-width: 768px) {
      .header {
        flex-direction: column;
        gap: 15px;
        text-align: center;
      }

      .pedidos-grid {
        grid-template-columns: 1fr;
      }

      .stats {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class PedidosListComponent implements OnInit {
  pedidos: any[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPedidos();
  }

  loadPedidos(): void {
    this.loading = true;
    this.error = null;

    this.apiService.getPedidos().subscribe({
      next: (pedidos) => {
        this.pedidos = pedidos;
        this.loading = false;
        console.log('Pedidos cargados:', pedidos);
      },
      error: (error) => {
        this.error = 'Error al cargar pedidos: ' + error.message;
        this.loading = false;
        console.error('Error:', error);
      }
    });
  }

  crearPedido(): void {
  this.router.navigate(['/pedidos/nuevo']);
}

  verPedido(id: number): void {
    alert(`Ver pedido ${id} - próximamente`);
  }

  editarPedido(id: number): void {
  this.router.navigate(['/pedidos/editar', id]);
}

  eliminarPedido(pedido: any): void {
    const confirmacion = confirm(
      `¿Estás seguro de eliminar el pedido #${pedido.pedidoId}?`
    );

    if (confirmacion) {
      this.apiService.deletePedido(pedido.pedidoId).subscribe({
        next: () => {
          this.pedidos = this.pedidos.filter(p => p.pedidoId !== pedido.pedidoId);
          alert('Pedido eliminado exitosamente');
        },
        error: (error) => {
          alert('Error al eliminar pedido: ' + error.message);
        }
      });
    }
  }

  getRentabilidadClass(indicador: string): string {
    switch (indicador) {
      case 'Verde': return 'rentabilidad-verde';
      case 'Amarillo': return 'rentabilidad-amarillo';
      case 'Rojo': return 'rentabilidad-rojo';
      default: return '';
    }
  }

  getTotalValue(): number {
    return this.pedidos.reduce((sum, pedido) => sum + pedido.total, 0);
  }

  getAverageRentability(): number {
    if (this.pedidos.length === 0) return 0;
    const sum = this.pedidos.reduce((sum, pedido) => sum + pedido.rentabilidadPromedio, 0);
    return sum / this.pedidos.length;
  }

  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-ES');
  }

  formatearMoneda(cantidad: number): string {
    return new Intl.NumberFormat('es-US', {
      style: 'currency',
      currency: 'USD'
    }).format(cantidad);
  }
}