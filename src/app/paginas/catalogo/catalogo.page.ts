import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController,IonContent, IonHeader, IonTitle, IonToolbar, LoadingController } from '@ionic/angular/standalone';
import {IonicModule} from '@ionic/angular'
import { GeneralService } from 'src/app/servicios/general.service';
import { CatalogoService } from 'src/app/servicios/catalogo.service';
@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.page.html',
  styleUrls: ['./catalogo.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class CatalogoPage implements OnInit {
  listaproductos:any[]=[];
  mostrarSoloActivos: boolean = true;
objetoRespuesta:any
  constructor(
        private servC:CatalogoService,
        private loading:LoadingController,
        public servG:GeneralService
  ) { }

  ngOnInit() {
  }
 ionViewWillEnter(){
    this.cargarProductos();
  }


async cargarProductos() {
  const l = await this.loading.create();
  l.present();

  this.servC.get_productos().subscribe({
    next: (respuesta: any) => {
      this.objetoRespuesta = respuesta;
      this.listaproductos= this.objetoRespuesta.data
      console.log(this.listaproductos)
      console.log(this.objetoRespuesta.prod_imagen);
      //if (this.objetoRespuesta.cant > 0) {
        //let todos = this.objetoRespuesta.datos;

        // Aplica filtro si mostrarSoloActivos es true
        //this.listaproductos = todos.datos//this.mostrarSoloActivos
         // ? todos.filter((c: any) => c.cli_estado === 'A')
          //: todos;

       // console.log("Productos cargados:", this.listaproductos);
        l.dismiss();
      //} else {
       // l.dismiss();
        //this.servG.fun_Mensaje("No existe datos");
     // }
    },
    error: (error) => {
      l.dismiss();
      this.servG.fun_Mensaje("Error al recuperar los productos");
      console.log(error);
    }
  });
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