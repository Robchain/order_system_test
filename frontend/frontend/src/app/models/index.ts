// Cliente interfaces
export interface Cliente {
  clienteId: number;
  nombre: string;
  email: string;
  telefono?: string;
  direccion?: string;
  fechaCreacion: string;
}

// Producto interfaces
export interface Producto {
  productoId: number;
  nombre: string;
  descripcion?: string;
  costo: number;
  precioVenta: number;
  stock: number;
  categoria?: string;
  activo: boolean;
  rentabilidadPorcentaje: number;
}

// Pedido interfaces
export interface Pedido {
  pedidoId: number;
  clienteId: number;
  clienteNombre?: string;
  fecha: string;
  total: number;
  rentabilidadPromedio: number;
  indicadorRentabilidad: string;
  estado: string;
  observaciones?: string;
  detalles: DetallePedido[];
}

export interface DetallePedido {
  detallePedidoId: number;
  productoId: number;
  productoNombre?: string;
  cantidad: number;
  precioUnitario: number;
  costoUnitario: number;
  subtotal: number;
  rentabilidadPorcentaje: number;
}

// DTOs para crear/editar
export interface CreatePedido {
  clienteId: number;
  fecha: string;
  observaciones?: string;
  detalles: CreateDetallePedido[];
}

export interface CreateDetallePedido {
  productoId: number;
  cantidad: number;
  precioUnitario: number;
}

export interface UpdatePedido {
  clienteId: number;
  fecha: string;
  estado: string;
  observaciones?: string;
  detalles: CreateDetallePedido[];
}

// Enums y constantes
export enum IndicadorRentabilidad {
  Rojo = 'Rojo',
  Amarillo = 'Amarillo',
  Verde = 'Verde'
}

export enum EstadoPedido {
  Pendiente = 'Pendiente',
  Procesando = 'Procesando',
  Completado = 'Completado',
  Cancelado = 'Cancelado'
}