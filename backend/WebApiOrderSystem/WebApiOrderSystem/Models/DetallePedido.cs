using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApiOrderSystem.Models
{
    public class DetallePedido
    {
        [Key]
        public int DetallePedidoId { get; set; }

        [Required]
        public int PedidoId { get; set; }

        [Required]
        public int ProductoId { get; set; }

        [Required]
        public int Cantidad { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal PrecioUnitario { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal CostoUnitario { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal Subtotal { get; set; }

        [Column(TypeName = "decimal(5,2)")]
        public decimal RentabilidadPorcentaje { get; set; }

        // Navigation properties
        [ForeignKey("PedidoId")]
        public virtual Pedido Pedido { get; set; } = null!;

        [ForeignKey("ProductoId")]
        public virtual Producto Producto { get; set; } = null!;

        // Method to calculate values
        public void CalcularValores()
        {
            Subtotal = Cantidad * PrecioUnitario;
            RentabilidadPorcentaje = PrecioUnitario > 0 ? ((PrecioUnitario - CostoUnitario) / PrecioUnitario) * 100 : 0;
        }
    }
}