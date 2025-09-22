namespace WebApiOrderSystem.DTOs
{
    public class ProductoDto
    {
        public int ProductoId { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string? Descripcion { get; set; }
        public decimal Costo { get; set; }
        public decimal PrecioVenta { get; set; }
        public int Stock { get; set; }
        public string? Categoria { get; set; }
        public bool Activo { get; set; }
        public decimal RentabilidadPorcentaje { get; set; }
    }
}