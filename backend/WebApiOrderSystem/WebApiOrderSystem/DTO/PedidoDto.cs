using System.ComponentModel.DataAnnotations;

namespace WebApiOrderSystem.DTOs
{
    public class PedidoDto
    {
        public int PedidoId { get; set; }
        public int ClienteId { get; set; }
        public string? ClienteNombre { get; set; }
        public DateTime Fecha { get; set; }
        public decimal Total { get; set; }
        public decimal RentabilidadPromedio { get; set; }
        public string IndicadorRentabilidad { get; set; } = string.Empty;
        public string Estado { get; set; } = string.Empty;
        public string? Observaciones { get; set; }
        public List<DetallePedidoDto> Detalles { get; set; } = new List<DetallePedidoDto>();
    }

    public class CreatePedidoDto
    {
        [Required]
        public int ClienteId { get; set; }

        [Required]
        public DateTime Fecha { get; set; }

        public string? Observaciones { get; set; }

        [Required]
        [MinLength(1, ErrorMessage = "El pedido debe tener al menos un detalle")]
        public List<CreateDetallePedidoDto> Detalles { get; set; } = new List<CreateDetallePedidoDto>();
    }

    public class UpdatePedidoDto
    {
        [Required]
        public int ClienteId { get; set; }

        [Required]
        public DateTime Fecha { get; set; }

        public string Estado { get; set; } = "Pendiente";
        public string? Observaciones { get; set; }

        [Required]
        [MinLength(1, ErrorMessage = "El pedido debe tener al menos un detalle")]
        public List<CreateDetallePedidoDto> Detalles { get; set; } = new List<CreateDetallePedidoDto>();
    }

    public class DetallePedidoDto
    {
        public int DetallePedidoId { get; set; }
        public int ProductoId { get; set; }
        public string? ProductoNombre { get; set; }
        public int Cantidad { get; set; }
        public decimal PrecioUnitario { get; set; }
        public decimal CostoUnitario { get; set; }
        public decimal Subtotal { get; set; }
        public decimal RentabilidadPorcentaje { get; set; }
    }

    public class CreateDetallePedidoDto
    {
        [Required]
        public int ProductoId { get; set; }

        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "La cantidad debe ser mayor a 0")]
        public int Cantidad { get; set; }

        [Required]
        [Range(0.01, double.MaxValue, ErrorMessage = "El precio debe ser mayor a 0")]
        public decimal PrecioUnitario { get; set; }
    }
}