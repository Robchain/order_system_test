# Backend

<!-- Instrucciones para ejecutar el backend -->

# Backend - AFECOR API

API REST desarrollada con .NET 8 para gestión de pedidos agroquímicos.

## Instalación

```bash
cd WebApiOrderSystem/WebApiOrderSystem
dotnet restore
dotnet run
```

## Configuración

### Base de Datos
La aplicación usa SQL Server LocalDB. La cadena de conexión está en `appsettings.json`:

```json
{
  "ConnectionStrings": {
    "Connection": "Server=(localdb)\\mssqlocaldb;Database=AfecorOrderSystemDB;Trusted_Connection=true"
  }
}
```

### Primera Ejecución
- La base de datos se crea automáticamente
- Se insertan datos de prueba iniciales
- La API estará en: http://localhost:5254

## Endpoints

### Pedidos
- `GET /api/pedidos` - Lista pedidos
- `POST /api/pedidos` - Crear pedido
- `PUT /api/pedidos/{id}` - Actualizar pedido
- `DELETE /api/pedidos/{id}` - Eliminar pedido

### Productos
- `GET /api/productos` - Lista productos

### Clientes
- `GET /api/clientes` - Lista clientes

## Documentación
Swagger UI disponible en: http://localhost:5254/swagger

## Datos de Prueba

### Clientes
- Agricola San José
- Cooperativa Valle Verde  
- Hacienda El Progreso

### Productos
- Herbicida Glifosato 48% - $75.00
- Insecticida Cipermetrina - $55.00
- Fungicida Mancozeb - $48.00
- Fertilizante NPK 20-20-20 - $25.00
- Adherente Siliconado - $22.00