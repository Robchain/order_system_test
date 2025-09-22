using System.ComponentModel.DataAnnotations;

namespace WebApiOrderSystem.Models
{
    public class Cliente
    {
        [Key]
        public int ClienteId { get; set; }

        [Required]
        [StringLength(100)]
        public string Nombre { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string Email { get; set; } = string.Empty;

        [StringLength(20)]
        public string? Telefono { get; set; }

        [StringLength(200)]
        public string? Direccion { get; set; }

        public DateTime FechaCreacion { get; set; } = DateTime.Now;

        // Navigation property
        public virtual ICollection<Pedido> Pedidos { get; set; } = new List<Pedido>();
    }
}