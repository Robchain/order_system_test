# Frontend

<!-- Instrucciones para ejecutar el frontend -->

# Frontend - AFECOR Angular App

Aplicación web desarrollada con Angular 20 para gestión de pedidos.

## Instalación

```bash
cd frontend
npm install
ng serve
```

La aplicación estará disponible en: http://localhost:4200

## Configuración

### URL del Backend
En `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5254/api'
};
```

## Estructura

```
src/app/
├── components/
│   ├── home/              # Página principal
│   ├── pedidos-list/      # Lista de pedidos
│   └── pedido-form/       # Formulario crear/editar
├── services/
│   └── api.service.ts     # Comunicación con backend
└── models/
    └── index.ts           # Interfaces TypeScript
```

## Funcionalidades

### Página Principal
- Prueba de conexión con backend
- Navegación a lista de pedidos

### Lista de Pedidos
- Vista en tarjetas con información resumida
- Indicadores de rentabilidad por colores
- Botones para crear, editar y eliminar
- Resumen estadístico

### Formulario de Pedidos
- Formulario reactivo con validaciones
- Cálculo automático de totales y rentabilidad
- Agregar/eliminar productos dinámicamente
- Modo crear y editar

## Tecnologías

- Angular 20
- Angular Material
- Reactive Forms
- TypeScript
- SCSS

## Rutas

- `/` - Página principal
- `/pedidos` - Lista de pedidos
- `/pedidos/nuevo` - Crear pedido
- `/pedidos/editar/:id` - Editar pedido

## Servicios

### ApiService
Maneja todas las comunicaciones con el backend:
- GET /pedidos
- POST /pedidos
- PUT /pedidos/:id
- DELETE /pedidos/:id
- GET /productos
- GET /clientes

## Validaciones

- Cliente requerido
- Fecha requerida
- Al menos un producto por pedido
- Cantidad mínima: 1
- Precio mínimo: $0.01

## Responsividad

La aplicación se adapta a:
- Desktop (vista completa)
- Tablet (columnas adaptativas)
- Móvil (vista en tarjetas)

## Moneda

Configurado para USD (dólares americanos) para Ecuador.