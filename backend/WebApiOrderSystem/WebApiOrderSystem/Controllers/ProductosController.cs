using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApiOrderSystem.Data;
using WebApiOrderSystem.DTOs;

namespace WebApiOrderSystem.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductosController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProductosController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/productos
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductoDto>>> GetProductos()
        {
            var productos = await _context.Productos
                .Where(p => p.Activo)
                .OrderBy(p => p.Categoria)
                .ThenBy(p => p.Nombre)
                .ToListAsync();

            var productosDto = productos.Select(p => new ProductoDto
            {
                ProductoId = p.ProductoId,
                Nombre = p.Nombre,
                Descripcion = p.Descripcion,
                Costo = p.Costo,
                PrecioVenta = p.PrecioVenta,
                Stock = p.Stock,
                Categoria = p.Categoria,
                Activo = p.Activo,
                RentabilidadPorcentaje = p.RentabilidadPorcentaje
            }).ToList();

            return Ok(productosDto);
        }

        // GET: api/productos/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ProductoDto>> GetProducto(int id)
        {
            var producto = await _context.Productos.FindAsync(id);

            if (producto == null)
            {
                return NotFound($"Producto con ID {id} no encontrado.");
            }

            var productoDto = new ProductoDto
            {
                ProductoId = producto.ProductoId,
                Nombre = producto.Nombre,
                Descripcion = producto.Descripcion,
                Costo = producto.Costo,
                PrecioVenta = producto.PrecioVenta,
                Stock = producto.Stock,
                Categoria = producto.Categoria,
                Activo = producto.Activo,
                RentabilidadPorcentaje = producto.RentabilidadPorcentaje
            };

            return Ok(productoDto);
        }
    }
}