import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-pedido-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="form-container">
      <!-- Header -->
      <div class="header">
       <h1>{{ isEditMode ? 'Editar Pedido #' + pedidoId : 'Nuevo Pedido' }}</h1>
        <button mat-button (click)="cancelar()">
          <mat-icon>arrow_back</mat-icon>
          Volver
        </button>
      </div>

      <!-- Loading -->
      <div *ngIf="loading" class="loading">
        <mat-spinner diameter="50"></mat-spinner>
        <p>Cargando datos...</p>
      </div>

      <!-- Formulario -->
      <form *ngIf="!loading" [formGroup]="pedidoForm" (ngSubmit)="onSubmit()">
        
        <!-- Información del Pedido -->
        <mat-card class="form-section">
          <mat-card-header>
            <mat-card-title>Información del Pedido</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            
            <!-- Cliente -->
            <mat-form-field appearance="outline">
              <mat-label>Cliente</mat-label>
              <mat-select formControlName="clienteId" required>
                <mat-option *ngFor="let cliente of clientes" [value]="cliente.clienteId">
                  {{ cliente.nombre }}
                </mat-option>
              </mat-select>
              <mat-error *ngIf="pedidoForm.get('clienteId')?.hasError('required')">
                El cliente es requerido
              </mat-error>
            </mat-form-field>

            <!-- Fecha -->
            <mat-form-field appearance="outline">
              <mat-label>Fecha del Pedido</mat-label>
              <input matInput [matDatepicker]="picker" formControlName="fecha" required>
              <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
              <mat-datepicker #picker></mat-datepicker>
              <mat-error *ngIf="pedidoForm.get('fecha')?.hasError('required')">
                La fecha es requerida
              </mat-error>
            </mat-form-field>

            <!-- Observaciones -->
            <mat-form-field appearance="outline">
              <mat-label>Observaciones</mat-label>
              <textarea matInput formControlName="observaciones" rows="3"
                        placeholder="Comentarios adicionales..."></textarea>
            </mat-form-field>

          </mat-card-content>
        </mat-card>

        <!-- Productos del Pedido -->
        <mat-card class="form-section">
          <mat-card-header>
            <mat-card-title>Productos del Pedido</mat-card-title>
            <button mat-icon-button type="button" (click)="agregarDetalle()">
              <mat-icon>add</mat-icon>
            </button>
          </mat-card-header>
          <mat-card-content>
            
            <div formArrayName="detalles">
              <div *ngFor="let detalle of detallesFormArray.controls; let i = index" 
                   [formGroupName]="i" class="detalle-row">
                
                <!-- Producto -->
                <mat-form-field appearance="outline">
                  <mat-label>Producto</mat-label>
                  <mat-select formControlName="productoId" required>
                    <mat-option *ngFor="let producto of productos" [value]="producto.productoId">
                      {{ producto.nombre }} (Stock: {{ producto.stock }})
                    </mat-option>
                  </mat-select>
                </mat-form-field>

                <!-- Cantidad -->
                <mat-form-field appearance="outline">
                  <mat-label>Cantidad</mat-label>
                  <input matInput type="number" formControlName="cantidad" min="1" required>
                </mat-form-field>

                <!-- Precio -->
                <mat-form-field appearance="outline">
                  <mat-label>Precio Unitario</mat-label>
                  <input matInput type="number" formControlName="precioUnitario" 
                         min="0.01" step="0.01" required>
                  <span matPrefix>$ </span>
                </mat-form-field>

                <!-- Subtotal -->
                <div class="subtotal">
                  <strong>Subtotal: {{ calcularSubtotal(detalle.value) | currency:'USD' }}</strong>
                  <br>
                  <small>Rentabilidad: {{ calcularRentabilidad(detalle.value) | number:'1.1-1' }}%</small>
                </div>

                <!-- Eliminar -->
                <button mat-icon-button type="button" color="warn" 
                        (click)="eliminarDetalle(i)"
                        [disabled]="detallesFormArray.length <= 1">
                  <mat-icon>delete</mat-icon>
                </button>

              </div>
            </div>

            <!-- Mensaje si no hay detalles -->
            <div *ngIf="detallesFormArray.length === 0" class="no-detalles">
              <p>No hay productos agregados</p>
              <button mat-raised-button color="primary" type="button" (click)="agregarDetalle()">
                Agregar Primer Producto
              </button>
            </div>

          </mat-card-content>
        </mat-card>

        <!-- Totales -->
        <mat-card class="totales-card">
          <mat-card-content>
            <div class="totales">
              <div class="total-item">
                <span>Total del Pedido:</span>
                <strong>{{ calcularTotal() | currency:'USD' }}</strong>
              </div>
              <div class="total-item">
                <span>Rentabilidad Promedio:</span>
                <strong>{{ calcularRentabilidadPromedio() | number:'1.1-1' }}%</strong>
              </div>
              <div class="total-item">
                <span>Indicador:</span>
                <span class="indicador" [class]="getIndicadorClass()">
                  {{ getIndicadorTexto() }}
                </span>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Acciones -->
        <div class="form-actions">
          <button mat-button type="button" (click)="cancelar()">
            Cancelar
          </button>
          <button mat-raised-button color="primary" type="submit" 
                  [disabled]="pedidoForm.invalid || saving">
            <mat-spinner *ngIf="saving" diameter="20"></mat-spinner>
            <mat-icon *ngIf="!saving">save</mat-icon>
            {{ saving ? 'Guardando...' : (isEditMode ? 'Actualizar Pedido' : 'Crear Pedido') }}
          </button>
        </div>

      </form>

    </div>
  `,
  styles: [`
    .form-container {
      padding: 20px;
      max-width: 1000px;
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

    .loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 60px 20px;
    }

    .form-section {
      margin-bottom: 20px;
    }

    .form-section mat-card-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      margin: -24px -24px 20px -24px;
      padding: 20px 24px;
    }

    .form-section mat-card-title {
      color: white;
      margin: 0;
    }

    .form-section mat-form-field {
      width: 100%;
      margin-bottom: 15px;
    }

    .detalle-row {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1fr 60px;
      gap: 15px;
      align-items: start;
      margin-bottom: 20px;
      padding: 15px;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
    }

    .subtotal {
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 10px;
      background-color: #f5f5f5;
      border-radius: 4px;
      text-align: center;
    }

    .no-detalles {
      text-align: center;
      padding: 40px;
      color: #666;
    }

    .totales-card {
      background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
      color: white;
      margin-bottom: 20px;
    }

    .totales {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
    }

    .total-item {
      display: flex;
      flex-direction: column;
      text-align: center;
      gap: 5px;
    }

    .indicador {
      padding: 4px 12px;
      border-radius: 15px;
      font-weight: 600;
      font-size: 0.9rem;
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

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 15px;
      padding: 20px 0;
    }

    @media (max-width: 768px) {
      .detalle-row {
        grid-template-columns: 1fr;
        gap: 10px;
      }
      
      .totales {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class PedidoFormComponent implements OnInit {
  pedidoForm!: FormGroup;
  clientes: any[] = [];
  productos: any[] = [];
  loading = false;
  saving = false;
  isEditMode = false;
  pedidoId?: number;
  
  constructor(
  private fb: FormBuilder,
  private apiService: ApiService,
  private router: Router,
  private route: ActivatedRoute
) {
  this.initForm();
}

  ngOnInit(): void {
    this.checkEditMode();
    this.loadData();
  }

  private checkEditMode(): void {
  const id = this.route.snapshot.paramMap.get('id');
  if (id) {
    this.isEditMode = true;
    this.pedidoId = +id;
  }
}

  private initForm(): void {
    this.pedidoForm = this.fb.group({
      clienteId: ['', Validators.required],
      fecha: [new Date(), Validators.required],
      observaciones: [''],
      detalles: this.fb.array([])
    });
  }

  get detallesFormArray(): FormArray {
    return this.pedidoForm.get('detalles') as FormArray;
  }

  private loadData(): void {
  this.loading = true;

  Promise.all([
    this.apiService.getClientes().toPromise(),
    this.apiService.getProductos().toPromise()
  ]).then(([clientes, productos]) => {
    this.clientes = clientes || [];
    this.productos = productos || [];
    
    if (this.isEditMode && this.pedidoId) {
      this.loadPedido();
    } else {
      this.loading = false;
      // Agregar un detalle inicial solo para nuevo pedido
      if (this.detallesFormArray.length === 0) {
        this.agregarDetalle();
      }
    }
  }).catch(error => {
    console.error('Error cargando datos:', error);
    this.loading = false;
  });
}
private loadPedido(): void {
  this.apiService.getPedido(this.pedidoId!).subscribe({
    next: (pedido) => {
      this.populateForm(pedido);
      this.loading = false;
    },
    error: (error) => {
      console.error('Error cargando pedido:', error);
      alert('Error al cargar el pedido');
      this.router.navigate(['/pedidos']);
      this.loading = false;
    }
  });
}
private populateForm(pedido: any): void {
  this.pedidoForm.patchValue({
    clienteId: pedido.clienteId,
    fecha: new Date(pedido.fecha),
    observaciones: pedido.observaciones
  });

  // Limpiar detalles existentes y agregar los del pedido
  this.detallesFormArray.clear();
  pedido.detalles.forEach((detalle: any) => {
    const detalleGroup = this.fb.group({
      productoId: [detalle.productoId, Validators.required],
      cantidad: [detalle.cantidad, [Validators.required, Validators.min(1)]],
      precioUnitario: [detalle.precioUnitario, [Validators.required, Validators.min(0.01)]]
    });
    this.detallesFormArray.push(detalleGroup);
  });
}

  agregarDetalle(): void {
    const detalleGroup = this.fb.group({
      productoId: ['', Validators.required],
      cantidad: [1, [Validators.required, Validators.min(1)]],
      precioUnitario: [0, [Validators.required, Validators.min(0.01)]]
    });

    this.detallesFormArray.push(detalleGroup);
  }

  eliminarDetalle(index: number): void {
    if (this.detallesFormArray.length > 1) {
      this.detallesFormArray.removeAt(index);
    }
  }

  calcularSubtotal(detalle: any): number {
    return (detalle.cantidad || 0) * (detalle.precioUnitario || 0);
  }

  calcularRentabilidad(detalle: any): number {
    const producto = this.productos.find(p => p.productoId === detalle.productoId);
    if (!producto || !detalle.precioUnitario) return 0;
    
    return ((detalle.precioUnitario - producto.costo) / detalle.precioUnitario) * 100;
  }

  calcularTotal(): number {
    return this.detallesFormArray.value.reduce((sum: number, detalle: any) => {
      return sum + this.calcularSubtotal(detalle);
    }, 0);
  }

  calcularRentabilidadPromedio(): number {
    const detalles = this.detallesFormArray.value;
    if (detalles.length === 0) return 0;
    
    const suma = detalles.reduce((sum: number, detalle: any) => {
      return sum + this.calcularRentabilidad(detalle);
    }, 0);
    
    return suma / detalles.length;
  }

  getIndicadorTexto(): string {
    const rentabilidad = this.calcularRentabilidadPromedio();
    if (rentabilidad < 20) return 'Rojo';
    if (rentabilidad <= 35) return 'Amarillo';
    return 'Verde';
  }

  getIndicadorClass(): string {
    const indicador = this.getIndicadorTexto();
    return `rentabilidad-${indicador.toLowerCase()}`;
  }

  onSubmit(): void {
  if (this.pedidoForm.invalid) {
    alert('Por favor complete todos los campos requeridos');
    return;
  }

  this.saving = true;

  const formValue = this.pedidoForm.value;
  const pedidoData = {
    clienteId: formValue.clienteId,
    fecha: formValue.fecha.toISOString(),
    observaciones: formValue.observaciones,
    detalles: formValue.detalles
  };

  if (this.isEditMode) {
    // Actualizar pedido existente
    this.apiService.updatePedido(this.pedidoId!, pedidoData).subscribe({
      next: (response) => {
        alert('Pedido actualizado exitosamente');
        this.router.navigate(['/pedidos']);
        this.saving = false;
      },
      error: (error) => {
        alert('Error al actualizar pedido: ' + error.message);
        this.saving = false;
      }
    });
  } else {
    // Crear nuevo pedido
    this.apiService.createPedido(pedidoData).subscribe({
      next: (response) => {
        alert('Pedido creado exitosamente');
        this.router.navigate(['/pedidos']);
        this.saving = false;
      },
      error: (error) => {
        alert('Error al crear pedido: ' + error.message);
        this.saving = false;
      }
    });
  }
}

  cancelar(): void {
    this.router.navigate(['/pedidos']);
  }
}