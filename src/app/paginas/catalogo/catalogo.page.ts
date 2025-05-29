import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController, LoadingController, ToastController } from '@ionic/angular/standalone';
import { IonicModule } from '@ionic/angular';
import { GeneralService } from 'src/app/servicios/general.service';
import { CatalogoService } from 'src/app/servicios/catalogo.service';
import { DetallePedido } from 'src/app/interfaces/detalle-pedido';
import { CarritoService } from 'src/app/servicios/carrito.service';




interface ProductoCarrito extends DetallePedido {
  nombre: string;
  subtotal: number;
}
@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.page.html',
  styleUrls: ['./catalogo.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class CatalogoPage implements OnInit {
  listaproductos: any[] = [];
  listaproductosAgrupados: any[][] = [];
  listaproductosAgrupadosFiltrados: any[][] = [];
  textoBusqueda: string = '';
  objetoRespuesta: any;
  cantidadCarrito: number = 0;
  carrito: DetallePedido[] = [];


  constructor(
    private servC: CatalogoService,
    private loading: LoadingController,
    private toast: ToastController,
    public servG: GeneralService,
    public servD: CarritoService
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.cargarProductos();
  }

  async cargarProductos() {
    const l = await this.loading.create();
    l.present();

    this.servC.get_productos().subscribe({
      next: (respuesta: any) => {
        this.objetoRespuesta = respuesta;
        this.listaproductos = this.objetoRespuesta.data;
        this.agruparProductos();
        this.filtrarProductos(); // inicializar también filtrados
        l.dismiss();
      },
      error: (error) => {
        l.dismiss();
        this.servG.fun_Mensaje("Error al recuperar los productos");
        console.log(error);
      }
    });
  }

  agruparProductos() {
    this.listaproductosAgrupados = [];
    for (let i = 0; i < this.listaproductos.length; i += 2) {
      this.listaproductosAgrupados.push(this.listaproductos.slice(i, i + 2));
    }
  }

filtrarProductos() {
  const texto = this.textoBusqueda.toLowerCase().trim();

  if (!texto) {
    // Sin búsqueda, mostrar todos los productos cargados
    this.listaproductosAgrupadosFiltrados = [...this.listaproductosAgrupados];
    return;
  }

  // Buscar en el backend
  this.servC.buscar_productos(texto).subscribe({
    next: (resp: any) => {
      const productos = resp.data || [];
      const filas: any[][] = [];

      for (let i = 0; i < productos.length; i += 2) {
        filas.push(productos.slice(i, i + 2));
      }

      this.listaproductosAgrupadosFiltrados = filas;
    },
    error: (err) => {
      console.error('Error al buscar productos:', err);
      this.servG.fun_Mensaje('Error al buscar productos');
    }
  });
}

async agregarAlCarrito(producto: any) {
  if (!this.servD.pedidoActual) {
    this.servD.crearPedido(1, 1); // cliente ID = 1, usuario ID = 1
  }

  if (this.servD.pedidoActual) {
    const detalle: ProductoCarrito = {
      det_id: 0,
      prod_id: producto.prod_id,
      ped_id: this.servD.pedidoActual.ped_id,
      det_cantidad: 1,
      det_precio: producto.prod_precio,
      nombre: producto.prod_nombre,
      subtotal: producto.prod_precio * 1,
    };

    this.servD.agregarProducto(detalle);
    this.cantidadCarrito = this.servD.carrito.length;

    const toast = await this.toast.create({
      message: `${producto.prod_nombre} agregado al carrito`,
      duration: 2000,
      color: 'success'
    });
    await toast.present();
  } else {
    this.servG.fun_Mensaje('Error al agregar al carrito: Pedido no encontrado');
    console.error('Error al agregar al carrito: Pedido no encontrado'); 
  }
}


  async seleccionarImagen(producto: any) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      const loading = await this.loading.create({
        message: 'Subiendo imagen...',
      });
      await loading.present();

      try {
        const updatedProduct = await this.servC.subir_imagen(file, producto.prod_id);
        this.servG.fun_Mensaje('Imagen actualizada correctamente');
        producto.prod_imagen = updatedProduct.prod_imagen + `?t=${Date.now()}`;
      } catch (error) {
        console.error('Error al subir imagen:', error);
        this.servG.fun_Mensaje('Error al subir la imagen');
      } finally {
        this.ionViewWillEnter();
        loading.dismiss();
      }
    };

    input.click();
  }


    fun_ir_carrito() {
    this.servG.irA('/carrito');
  }


}
