import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import {
  IonicModule,
  LoadingController,
  IonItemSliding,
  AlertController,
} from '@ionic/angular';

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
  listaProductos: any[] = [];
  objectoRespuesta: any;

  constructor(
    private loading: LoadingController,
    public servG: GeneralService,
    private alert: AlertController,
    private servC: CatalogoService
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.cargarProductos();
  }

  async cargarProductos() {
    const l = await this.loading.create();
    await l.present();

    try {
      const respuesta = await this.servC.get_productos();
      this.objectoRespuesta = respuesta;
      if (this.objectoRespuesta.cant > 0) {
        this.listaProductos = this.objectoRespuesta.data;
      } else {
        this.listaProductos = [];
        this.servG.fun_Mensaje('Error: NO DATA');
      }
    } catch (error) {
      this.servG.fun_Mensaje('Error al recuperar los datos');
    } finally {
      l.dismiss();
    }
  }
  // Método para seleccionar una imagen desde galería y subirla
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
        await this.servC.subir_imagen(file, producto.prod_id);
        this.servG.fun_Mensaje('Imagen actualizada correctamente');
        // Actualizar la imagen local para ver el cambio sin recargar toda la lista
        producto.prod_imagen = file.name; // o la ruta devuelta por el backend si la recibes
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
