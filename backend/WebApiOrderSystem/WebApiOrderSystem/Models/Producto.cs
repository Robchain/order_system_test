using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApiOrderSystem.Models
{
    public class Producto
    {
        [Key]
        public int ProductoId { get; set; }

        [Required]
        [StringLength(100)]
        public string Nombre { get; set; } = string.Empty;

        [StringLength(500)]
        public string? Descripcion { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Costo { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal PrecioVenta { get; set; }

        [Required]
        public int Stock { get; set; }

        [StringLength(50)]
        public string? Categoria { get; set; }

        public bool Activo { get; set; } = true;

        public DateTime FechaCreacion { get; set; } = DateTime.Now;

        // Navigation property
        public virtual ICollection<DetallePedido> DetallesPedido { get; set; } = new List<DetallePedido>();

        // Calculated property for profitability
        [NotMapped]
        public decimal RentabilidadPorcentaje => PrecioVenta > 0 ? ((PrecioVenta - Costo) / PrecioVenta) * 100 : 0;
    }
}