// src/main.ts - Bootstrap muy simple
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter, Routes } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

// Rutas simples
const routes: Routes = [
  { 
    path: '', 
    loadComponent: () => import('./app/components/home/home.component').then(m => m.HomeComponent) 
  },
  { 
    path: 'pedidos', 
    loadComponent: () => import('./app/components/pedidos-list/pedidos-list.component').then(m => m.PedidosListComponent) 
  },
  {
  path: 'pedidos/nuevo',
  loadComponent: () => import('./app/components/pedido-form/pedido-form.component').then(m => m.PedidoFormComponent)
},
{
  path: 'pedidos/editar/:id',
  loadComponent: () => import('./app/components/pedido-form/pedido-form.component').then(m => m.PedidoFormComponent)
},
  { path: '**', redirectTo: '/' }
];

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideAnimations()
  ]
}).catch(err => console.error(err));