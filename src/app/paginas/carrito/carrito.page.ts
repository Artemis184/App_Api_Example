import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { CarritoService } from 'src/app/servicios/carrito.service';
import { DetallePedido } from 'src/app/interfaces/detalle-pedido';
import { IonicModule } from '@ionic/angular';
import { Pedido } from 'src/app/interfaces/pedido';
import { CatalogoService  } from 'src/app/servicios/catalogo.service';
import { finalize } from 'rxjs/operators';


interface ProductoCarrito extends DetallePedido {
  nombre: string;
  subtotal: number;
}
@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.page.html',
  styleUrls: ['./carrito.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class CarritoPage implements OnInit {

  productosCarrito: (DetallePedido & { nombre: string })[] = [];
  pedido: Pedido | null = null;
  totalGeneral: number = 0;

  constructor(private servD: CarritoService,
      private servC: CatalogoService

  ) {}

ngOnInit() {
  this.pedido = this.servD.pedidoActual;
  const carrito = this.servD.obtenerCarrito();

  this.servC.get_productos().subscribe((respuesta: any) => {
    const productosBD = respuesta.data;

    this.productosCarrito = carrito.map((item): ProductoCarrito => {
      const prodBD = productosBD.find((p: any) => p.prod_id === item.prod_id);
      return {
        ...item,
        nombre: prodBD?.prod_nombre || 'Producto desconocido',
        det_precio: prodBD?.prod_precio || item.det_precio,
        subtotal: item.det_cantidad * (prodBD?.prod_precio || item.det_precio),
      };
    });

    this.recalcularTotales();
  });
}


  recalcularTotales() {
    this.totalGeneral = this.productosCarrito.reduce((acc, prod) =>
      acc + (prod.det_cantidad * prod.det_precio), 0);
  }


cambiarCantidad(prod: any, cambio: number) {
  const nuevaCantidad = prod.det_cantidad + cambio;
  if (nuevaCantidad >= 1) {
    prod.det_cantidad = nuevaCantidad;
    prod.subtotal = prod.det_precio * nuevaCantidad;
    this.recalcularTotales();
    this.actualizarCarritoEnServicio(prod);
  }
}

actualizarCarritoEnServicio(prodActualizado: DetallePedido) {
  const carrito = this.servD.obtenerCarrito();

  const index = carrito.findIndex(p => p.prod_id === prodActualizado.prod_id);
  if (index > -1) {
    carrito[index].det_cantidad = prodActualizado.det_cantidad;
    carrito[index].det_precio = prodActualizado.det_precio;
  }

  this.servD.actualizarCarrito(carrito);
}


enviarPedido() {
  if (!this.pedido) {
    this.servD.fun_Mensaje('No hay un pedido activo');
    return;
  }

  // Prepara objeto pedido sin ped_id (lo genera backend)
  const pedidoParaEnviar: Omit<Pedido, 'ped_id'> = {
    cli_id: this.pedido.cli_id,
    usr_id: this.pedido.usr_id,
    ped_fecha: this.pedido.ped_fecha,
    ped_estado: this.pedido.ped_estado
  };

  // Prepara array de detalles sin det_id ni ped_id
  const detallesParaEnviar: Omit<DetallePedido, 'det_id' | 'ped_id'>[] = this.productosCarrito.map(p => ({
    prod_id: p.prod_id,
    det_cantidad: p.det_cantidad,
    det_precio: p.det_precio
  }));

  this.servD.guardarPedido(pedidoParaEnviar, detallesParaEnviar).subscribe({
    next: res => {
      this.servD.fun_Mensaje('Pedido guardado correctamente.');
      // Opcional: limpiar carrito y pedido actual
      this.servD.pedidoActual = null;
      this.servD.actualizarCarrito([]);
      this.productosCarrito = [];
      this.totalGeneral = 0;
      this.pedido = null;
    },
    error: err => {
      console.error(err);
      this.servD.fun_Mensaje('Error al guardar el pedido.');
    }
  });
}

}
