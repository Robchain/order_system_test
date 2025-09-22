import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PedidosListComponent } from './components/pedidos-list/pedidos-list.component';
import { PedidoFormComponent } from './components/pedido-form/pedido-form.component';

const routes: Routes = [
  // Ruta por defecto - Lista de pedidos
  { path: '', redirectTo: '/pedidos', pathMatch: 'full' },
  
  // Lista de pedidos
  { path: 'pedidos', component: PedidosListComponent },
  
  // Crear nuevo pedido
  { path: 'pedidos/nuevo', component: PedidoFormComponent },
  
  // Editar pedido existente
  { path: 'pedidos/editar/:id', component: PedidoFormComponent },
  
  // Ver detalles de pedido (solo lectura)
  { path: 'pedidos/ver/:id', component: PedidoFormComponent },
  
  // Ruta comodín para páginas no encontradas
  { path: '**', redirectTo: '/pedidos' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }