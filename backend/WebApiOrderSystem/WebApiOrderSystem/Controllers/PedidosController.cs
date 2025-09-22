using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApiOrderSystem.Data;
using WebApiOrderSystem.DTOs;
using WebApiOrderSystem.Models;

namespace WebApiOrderSystem.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PedidosController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PedidosController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/pedidos
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PedidoDto>>> GetPedidos()
        {
            var pedidos = await _context.Pedidos
                .Include(p => p.Cliente)
                .Include(p => p.DetallesPedido)
                    .ThenInclude(dp => dp.Producto)
                .OrderByDescending(p => p.Fecha)
                .ToListAsync();

            var pedidosDto = pedidos.Select(p => new PedidoDto
            {
                PedidoId = p.PedidoId,
                ClienteId = p.ClienteId,
                ClienteNombre = p.Cliente.Nombre,
                Fecha = p.Fecha,
                Total = p.Total,
                RentabilidadPromedio = p.RentabilidadPromedio,
                IndicadorRentabilidad = p.IndicadorRentabilidad,
                Estado = p.Estado,
                Observaciones = p.Observaciones,
                Detalles = p.DetallesPedido.Select(dp => new DetallePedidoDto
                {
                    DetallePedidoId = dp.DetallePedidoId,
                    ProductoId = dp.ProductoId,
                    ProductoNombre = dp.Producto.Nombre,
                    Cantidad = dp.Cantidad,
                    PrecioUnitario = dp.PrecioUnitario,
                    CostoUnitario = dp.CostoUnitario,
                    Subtotal = dp.Subtotal,
                    RentabilidadPorcentaje = dp.RentabilidadPorcentaje
                }).ToList()
            }).ToList();

            return Ok(pedidosDto);
        }

        // GET: api/pedidos/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PedidoDto>> GetPedido(int id)
        {
            var pedido = await _context.Pedidos
                .Include(p => p.Cliente)
                .Include(p => p.DetallesPedido)
                    .ThenInclude(dp => dp.Producto)
                .FirstOrDefaultAsync(p => p.PedidoId == id);

            if (pedido == null)
            {
                return NotFound($"Pedido con ID {id} no encontrado.");
            }

            var pedidoDto = new PedidoDto
            {
                PedidoId = pedido.PedidoId,
                ClienteId = pedido.ClienteId,
                ClienteNombre = pedido.Cliente.Nombre,
                Fecha = pedido.Fecha,
                Total = pedido.Total,
                RentabilidadPromedio = pedido.RentabilidadPromedio,
                IndicadorRentabilidad = pedido.IndicadorRentabilidad,
                Estado = pedido.Estado,
                Observaciones = pedido.Observaciones,
                Detalles = pedido.DetallesPedido.Select(dp => new DetallePedidoDto
                {
                    DetallePedidoId = dp.DetallePedidoId,
                    ProductoId = dp.ProductoId,
                    ProductoNombre = dp.Producto.Nombre,
                    Cantidad = dp.Cantidad,
                    PrecioUnitario = dp.PrecioUnitario,
                    CostoUnitario = dp.CostoUnitario,
                    Subtotal = dp.Subtotal,
                    RentabilidadPorcentaje = dp.RentabilidadPorcentaje
                }).ToList()
            };

            return Ok(pedidoDto);
        }

        // POST: api/pedidos
        [HttpPost]
        public async Task<ActionResult<PedidoDto>> CreatePedido(CreatePedidoDto createPedidoDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Verificar que el cliente existe
            var cliente = await _context.Clientes.FindAsync(createPedidoDto.ClienteId);
            if (cliente == null)
            {
                return BadRequest($"Cliente con ID {createPedidoDto.ClienteId} no existe.");
            }

            // Verificar que todos los productos existen y tienen stock
            var productosIds = createPedidoDto.Detalles.Select(d => d.ProductoId).ToList();
            var productos = await _context.Productos
                .Where(p => productosIds.Contains(p.ProductoId))
                .ToListAsync();

            if (productos.Count != productosIds.Count)
            {
                return BadRequest("Uno o más productos no existen.");
            }

            // Crear el pedido
            var pedido = new Pedido
            {
                ClienteId = createPedidoDto.ClienteId,
                Fecha = createPedidoDto.Fecha,
                Observaciones = createPedidoDto.Observaciones,
                Estado = "Pendiente"
            };

            _context.Pedidos.Add(pedido);
            await _context.SaveChangesAsync();

            // Crear los detalles
            decimal totalPedido = 0;
            decimal sumaRentabilidad = 0;

            foreach (var detalleDto in createPedidoDto.Detalles)
            {
                var producto = productos.First(p => p.ProductoId == detalleDto.ProductoId);

                var detalle = new DetallePedido
                {
                    PedidoId = pedido.PedidoId,
                    ProductoId = detalleDto.ProductoId,
                    Cantidad = detalleDto.Cantidad,
                    PrecioUnitario = detalleDto.PrecioUnitario,
                    CostoUnitario = producto.Costo
                };

                detalle.CalcularValores();
                _context.DetallesPedido.Add(detalle);

                totalPedido += detalle.Subtotal;
                sumaRentabilidad += detalle.RentabilidadPorcentaje;
            }

            // Actualizar totales del pedido
            pedido.Total = totalPedido;
            pedido.RentabilidadPromedio = createPedidoDto.Detalles.Count > 0 ?
                sumaRentabilidad / createPedidoDto.Detalles.Count : 0;

            await _context.SaveChangesAsync();

            // Retornar el pedido creado
            return await GetPedido(pedido.PedidoId);
        }

        // PUT: api/pedidos/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePedido(int id, UpdatePedidoDto updatePedidoDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var pedido = await _context.Pedidos
                .Include(p => p.DetallesPedido)
                .FirstOrDefaultAsync(p => p.PedidoId == id);

            if (pedido == null)
            {
                return NotFound($"Pedido con ID {id} no encontrado.");
            }

            // Verificar que el cliente existe
            var cliente = await _context.Clientes.FindAsync(updatePedidoDto.ClienteId);
            if (cliente == null)
            {
                return BadRequest($"Cliente con ID {updatePedidoDto.ClienteId} no existe.");
            }

            // Eliminar detalles existentes
            _context.DetallesPedido.RemoveRange(pedido.DetallesPedido);

            // Actualizar pedido
            pedido.ClienteId = updatePedidoDto.ClienteId;
            pedido.Fecha = updatePedidoDto.Fecha;
            pedido.Estado = updatePedidoDto.Estado;
            pedido.Observaciones = updatePedidoDto.Observaciones;

            // Verificar productos
            var productosIds = updatePedidoDto.Detalles.Select(d => d.ProductoId).ToList();
            var productos = await _context.Productos
                .Where(p => productosIds.Contains(p.ProductoId))
                .ToListAsync();

            if (productos.Count != productosIds.Count)
            {
                return BadRequest("Uno o más productos no existen.");
            }

            // Crear nuevos detalles
            decimal totalPedido = 0;
            decimal sumaRentabilidad = 0;

            foreach (var detalleDto in updatePedidoDto.Detalles)
            {
                var producto = productos.First(p => p.ProductoId == detalleDto.ProductoId);

                var detalle = new DetallePedido
                {
                    PedidoId = pedido.PedidoId,
                    ProductoId = detalleDto.ProductoId,
                    Cantidad = detalleDto.Cantidad,
                    PrecioUnitario = detalleDto.PrecioUnitario,
                    CostoUnitario = producto.Costo
                };

                detalle.CalcularValores();
                _context.DetallesPedido.Add(detalle);

                totalPedido += detalle.Subtotal;
                sumaRentabilidad += detalle.RentabilidadPorcentaje;
            }

            // Actualizar totales
            pedido.Total = totalPedido;
            pedido.RentabilidadPromedio = updatePedidoDto.Detalles.Count > 0 ?
                sumaRentabilidad / updatePedidoDto.Detalles.Count : 0;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/pedidos/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePedido(int id)
        {
            var pedido = await _context.Pedidos.FindAsync(id);
            if (pedido == null)
            {
                return NotFound($"Pedido con ID {id} no encontrado.");
            }

            _context.Pedidos.Remove(pedido);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}