using Microsoft.EntityFrameworkCore;
using WebApiOrderSystem.Models;

namespace WebApiOrderSystem.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Cliente> Clientes { get; set; }
        public DbSet<Producto> Productos { get; set; }
        public DbSet<Pedido> Pedidos { get; set; }
        public DbSet<DetallePedido> DetallesPedido { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configuraciones de relaciones
            modelBuilder.Entity<Pedido>()
                .HasOne(p => p.Cliente)
                .WithMany(c => c.Pedidos)
                .HasForeignKey(p => p.ClienteId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<DetallePedido>()
                .HasOne(dp => dp.Pedido)
                .WithMany(p => p.DetallesPedido)
                .HasForeignKey(dp => dp.PedidoId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<DetallePedido>()
                .HasOne(dp => dp.Producto)
                .WithMany(pr => pr.DetallesPedido)
                .HasForeignKey(dp => dp.ProductoId)
                .OnDelete(DeleteBehavior.Restrict);

            // Índices para mejor performance
            modelBuilder.Entity<Cliente>()
                .HasIndex(c => c.Email)
                .IsUnique();

            modelBuilder.Entity<Pedido>()
                .HasIndex(p => p.Fecha);

            // Datos de prueba (Seed Data)
            SeedData(modelBuilder);
        }

        private void SeedData(ModelBuilder modelBuilder)
        {
            // Clientes de prueba
            modelBuilder.Entity<Cliente>().HasData(
                new Cliente { ClienteId = 1, Nombre = "Agricola San José", Email = "info@agricolasanjose.com", Telefono = "123-456-7890", Direccion = "Av. Principal 123, Lima" },
                new Cliente { ClienteId = 2, Nombre = "Cooperativa Valle Verde", Email = "contacto@valleverde.coop", Telefono = "987-654-3210", Direccion = "Carretera Norte Km 45, Trujillo" },
                new Cliente { ClienteId = 3, Nombre = "Hacienda El Progreso", Email = "ventas@elprogreso.pe", Telefono = "555-123-4567", Direccion = "Fundo Rural S/N, Chiclayo" }
            );

            // Productos agroquímicos de prueba
            modelBuilder.Entity<Producto>().HasData(
                new Producto { ProductoId = 1, Nombre = "Herbicida Glifosato 48%", Descripcion = "Herbicida sistémico no selectivo", Costo = 45.00m, PrecioVenta = 75.00m, Stock = 100, Categoria = "Herbicidas" },
                new Producto { ProductoId = 2, Nombre = "Insecticida Cipermetrina", Descripcion = "Insecticida piretroide de contacto", Costo = 32.00m, PrecioVenta = 55.00m, Stock = 80, Categoria = "Insecticidas" },
                new Producto { ProductoId = 3, Nombre = "Fungicida Mancozeb", Descripcion = "Fungicida preventivo de contacto", Costo = 28.50m, PrecioVenta = 48.00m, Stock = 120, Categoria = "Fungicidas" },
                new Producto { ProductoId = 4, Nombre = "Fertilizante NPK 20-20-20", Descripcion = "Fertilizante foliar completo", Costo = 18.00m, PrecioVenta = 25.00m, Stock = 200, Categoria = "Fertilizantes" },
                new Producto { ProductoId = 5, Nombre = "Adherente Siliconado", Descripcion = "Coadyuvante mejorador de adherencia", Costo = 12.00m, PrecioVenta = 22.00m, Stock = 150, Categoria = "Coadyuvantes" }
            );
        }
    }
}