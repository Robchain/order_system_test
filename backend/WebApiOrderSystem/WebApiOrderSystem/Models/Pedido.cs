using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApiOrderSystem.Models
{
    public class Pedido
    {
        [Key]
        public int PedidoId { get; set; }

        [Required]
        public int ClienteId { get; set; }

        [Required]
        public DateTime Fecha { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal Total { get; set; }

        [Column(TypeName = "decimal(5,2)")]
        public decimal RentabilidadPromedio { get; set; }

        [StringLength(50)]
        public string Estado { get; set; } = "Pendiente"; // Pendiente, Procesando, Completado, Cancelado

        [StringLength(500)]
        public string? Observaciones { get; set; }

        public DateTime FechaCreacion { get; set; } = DateTime.Now;

        // Navigation properties
        [ForeignKey("ClienteId")]
        public virtual Cliente Cliente { get; set; } = null!;

        public virtual ICollection<DetallePedido> DetallesPedido { get; set; } = new List<DetallePedido>();

        // Calculated property for profitability indicator
        [NotMapped]
        public string IndicadorRentabilidad =>
            RentabilidadPromedio < 20 ? "Rojo" :
            RentabilidadPromedio <= 35 ? "Amarillo" : "Verde";
    }
}