import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../enviroments/environment';
import { 
  Pedido, 
  CreatePedido, 
  UpdatePedido, 
  Producto, 
  Cliente 
} from '../models';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // =============== MÉTODOS PARA PEDIDOS ===============

  /**
   * Obtiene todos los pedidos
   */
  getPedidos(): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(`${this.apiUrl}/pedidos`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Obtiene un pedido específico por ID
   */
  getPedido(id: number): Observable<Pedido> {
    return this.http.get<Pedido>(`${this.apiUrl}/pedidos/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Crea un nuevo pedido
   */
  createPedido(pedido: CreatePedido): Observable<Pedido> {
    return this.http.post<Pedido>(`${this.apiUrl}/pedidos`, pedido)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Actualiza un pedido existente
   */
  updatePedido(id: number, pedido: UpdatePedido): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/pedidos/${id}`, pedido)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Elimina un pedido
   */
  deletePedido(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/pedidos/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // =============== MÉTODOS PARA PRODUCTOS ===============

  /**
   * Obtiene todos los productos disponibles
   */
  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.apiUrl}/productos`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Obtiene un producto específico por ID
   */
  getProducto(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.apiUrl}/productos/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // =============== MÉTODOS PARA CLIENTES ===============

  /**
   * Obtiene todos los clientes disponibles
   */
  getClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(`${this.apiUrl}/clientes`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Obtiene un cliente específico por ID
   */
  getCliente(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.apiUrl}/clientes/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // =============== MANEJO DE ERRORES ===============

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ha ocurrido un error desconocido';
    
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      switch (error.status) {
        case 400:
          errorMessage = 'Solicitud incorrecta. Verifica los datos enviados.';
          break;
        case 401:
          errorMessage = 'No autorizado. Verifica tus credenciales.';
          break;
        case 404:
          errorMessage = 'Recurso no encontrado.';
          break;
        case 500:
          errorMessage = 'Error interno del servidor. Intenta más tarde.';
          break;
        default:
          errorMessage = `Error ${error.status}: ${error.message}`;
      }
    }

    console.error('Error de API:', errorMessage, error);
    return throwError(() => new Error(errorMessage));
  }
}