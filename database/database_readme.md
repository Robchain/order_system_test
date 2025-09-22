# Database

<!-- Scripts SQL y instrucciones de base de datos -->

# Base de Datos - AFECOR Sistema de Pedidos

Scripts SQL para crear la base de datos completa con tablas y datos de prueba.

## Archivos Incluidos

- `database-script.sql` - Script completo con tablas y datos de prueba

## Instalación Manual (Opción 1)

### Requisitos
- SQL Server 2019+ o SQL Server Express
- SQL Server Management Studio (SSMS) o similar

### Pasos

1. **Abrir SQL Server Management Studio**
   ```
   Conectarse a la instancia: (localdb)\mssqlocaldb
   O tu servidor SQL Server local
   ```

2. **Ejecutar el script**
   ```sql
   -- Abrir el archivo database-script.sql en SSMS
   -- Ejecutar todo el contenido (F5)
   ```

3. **Verificar la instalación**
   ```sql
   USE AfecorOrderSystemDB;
   
   -- Verificar tablas creadas
   SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES;
   
   -- Verificar datos
   SELECT COUNT(*) FROM Clientes;    -- Debe retornar 3
   SELECT COUNT(*) FROM Productos;   -- Debe retornar 5
   ```

## Instalación Automática (Opción 2)

El backend de .NET está configurado para crear automáticamente la base de datos cuando se ejecuta por primera vez.

```bash
cd backend/WebApiOrderSystem/WebApiOrderSystem
dotnet run
```

La aplicación:
- Creará la base de datos si no existe
- Aplicará el esquema de tablas
- Insertará los datos de prueba

## Estructura de la Base de Datos

### Tablas Principales

#### Clientes
```sql
CREATE TABLE Clientes (
    ClienteId INT PRIMARY KEY IDENTITY(1,1),
    Nombre NVARCHAR(100) NOT NULL,
    Email NVARCHAR(100) NOT NULL UNIQUE,
    Telefono NVARCHAR(20),
    Direccion NVARCHAR(200),
    FechaCreacion DATETIME2 DEFAULT GETDATE()
);
```

#### Productos
```sql
CREATE TABLE Productos (
    ProductoId INT PRIMARY KEY IDENTITY(1,1),
    Nombre NVARCHAR(100) NOT NULL,
    Descripcion NVARCHAR(500),
    Costo DECIMAL(18,2) NOT NULL,
    PrecioVenta DECIMAL(18,2) NOT NULL,
    Stock INT NOT NULL,
    Categoria NVARCHAR(50),
    Activo BIT DEFAULT 1,
    FechaCreacion DATETIME2 DEFAULT GETDATE()
);
```

#### Pedidos
```sql
CREATE TABLE Pedidos (
    PedidoId INT PRIMARY KEY IDENTITY(1,1),
    ClienteId INT NOT NULL,
    Fecha DATETIME2 NOT NULL,
    Total DECIMAL(18,2) DEFAULT 0,
    RentabilidadPromedio DECIMAL(5,2) DEFAULT 0,
    Estado NVARCHAR(50) DEFAULT 'Pendiente',
    Observaciones NVARCHAR(500),
    FechaCreacion DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (ClienteId) REFERENCES Clientes(ClienteId)
);
```

#### DetallesPedido
```sql
CREATE TABLE DetallesPedido (
    DetallePedidoId INT PRIMARY KEY IDENTITY(1,1),
    PedidoId INT NOT NULL,
    ProductoId INT NOT NULL,
    Cantidad INT NOT NULL,
    PrecioUnitario DECIMAL(18,2) NOT NULL,
    CostoUnitario DECIMAL(18,2) NOT NULL,
    Subtotal DECIMAL(18,2) NOT NULL,
    RentabilidadPorcentaje DECIMAL(5,2) NOT NULL,
    FOREIGN KEY (PedidoId) REFERENCES Pedidos(PedidoId) ON DELETE CASCADE,
    FOREIGN KEY (ProductoId) REFERENCES Productos(ProductoId)
);
```

## Datos de Prueba Incluidos

### Clientes (3 registros)
- Agricola San José
- Cooperativa Valle Verde
- Hacienda El Progreso

### Productos (5 registros)
- Herbicida Glifosato 48% - $75.00
- Insecticida Cipermetrina - $55.00
- Fungicida Mancozeb - $48.00
- Fertilizante NPK 20-20-20 - $25.00
- Adherente Siliconado - $22.00

## Configuración de Conexión

### Para Desarrollo Local
```json
{
  "ConnectionStrings": {
    "Connection": "Server=(localdb)\\mssqlocaldb;Database=AfecorOrderSystemDB;Trusted_Connection=true;MultipleActiveResultSets=true"
  }
}
```

### Para SQL Server Express
```json
{
  "ConnectionStrings": {
    "Connection": "Server=.\\SQLEXPRESS;Database=AfecorOrderSystemDB;Trusted_Connection=true;MultipleActiveResultSets=true"
  }
}
```

### Para SQL Server con Autenticación
```json
{
  "ConnectionStrings": {
    "Connection": "Server=tu-servidor;Database=AfecorOrderSystemDB;User Id=tu-usuario;Password=tu-password;MultipleActiveResultSets=true"
  }
}
```

## Verificación Post-Instalación

### Consultas de Verificación
```sql
-- Verificar estructura
SELECT 
    t.TABLE_NAME,
    COUNT(c.COLUMN_NAME) as ColumnCount
FROM INFORMATION_SCHEMA.TABLES t
LEFT JOIN INFORMATION_SCHEMA.COLUMNS c ON t.TABLE_NAME = c.TABLE_NAME
WHERE t.TABLE_TYPE = 'BASE TABLE'
GROUP BY t.TABLE_NAME;

-- Verificar datos
SELECT 'Clientes' as Tabla, COUNT(*) as Registros FROM Clientes
UNION ALL
SELECT 'Productos', COUNT(*) FROM Productos
UNION ALL
SELECT 'Pedidos', COUNT(*) FROM Pedidos
UNION ALL
SELECT 'DetallesPedido', COUNT(*) FROM DetallesPedido;

-- Verificar productos con precios
SELECT 
    Nombre,
    PrecioVenta,
    Costo,
    ((PrecioVenta - Costo) / PrecioVenta) * 100 as RentabilidadPorcentaje
FROM Productos
ORDER BY Categoria, Nombre;
```

## Troubleshooting

### Error: Base de datos ya existe
```sql
-- Eliminar base de datos existente (CUIDADO: elimina todos los datos)
DROP DATABASE IF EXISTS AfecorOrderSystemDB;
-- Luego ejecutar el script completo
```

### Error: Permisos insuficientes
- Verificar que el usuario tenga permisos de creación de BD
- Ejecutar SQL Server Management Studio como administrador
- Usar una cuenta con permisos de sysadmin o dbcreator

### Error: Conexión fallida
- Verificar que SQL Server esté ejecutándose
- Confirmar el nombre de la instancia
- Revisar la cadena de conexión en appsettings.json

## Backup y Restore

### Crear Backup
```sql
BACKUP DATABASE AfecorOrderSystemDB 
TO DISK = 'C:\Backup\AfecorOrderSystemDB.bak'
WITH FORMAT, INIT;
```

### Restaurar Backup
```sql
RESTORE DATABASE AfecorOrderSystemDB 
FROM DISK = 'C:\Backup\AfecorOrderSystemDB.bak'
WITH REPLACE;
```