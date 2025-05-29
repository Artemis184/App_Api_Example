import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController, LoadingController, ToastController } from '@ionic/angular/standalone';
import { IonicModule } from '@ionic/angular';
import { GeneralService } from 'src/app/servicios/general.service';
import { CatalogoService } from 'src/app/servicios/catalogo.service';

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
carrito: any[] = [];


  constructor(
    private servC: CatalogoService,
    private loading: LoadingController,
    private toast: ToastController,
    public servG: GeneralService
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
  // Agregar el producto al carrito
  this.carrito.push(producto);

  // Incrementar contador
  this.cantidadCarrito = this.carrito.length;


  console.log(this.carrito);

  // Mostrar confirmación
  const toast = await this.toast.create({
    message: `${producto.prod_nombre} agregado al carrito`,
    duration: 2000,
    color: 'success'
  });
  await toast.present();
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
}
