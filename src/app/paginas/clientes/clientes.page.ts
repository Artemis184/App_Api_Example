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
import { ClientesService } from 'src/app/servicios/clientes.service';
import { GeneralService } from 'src/app/servicios/general.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.page.html',
  styleUrls: ['./clientes.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class ClientesPage implements OnInit {
  listaClientes: any[] = [];
  objectoRespuesta: any;

  mostrarTodos: boolean = false;

listaClientesOriginal: any[] = []; // copia completa
  constructor(
    private servC: ClientesService,
    private loading: LoadingController,
    public servG: GeneralService,
    private alert: AlertController
  ) {}

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.cargarClientes();
  }

  async cargarClientes() {
    let l = await this.loading.create();
    l.present();
    this.servC.get_clientes().subscribe(
      (respuesta: any) => {
        this.objectoRespuesta = respuesta;
        if (this.objectoRespuesta.cant > 0) {
          this.listaClientesOriginal = this.objectoRespuesta.data;
          this.filtrarClientes(); // Aplicar filtro de mostrarTodos
        } else {
          this.listaClientes = [];
          this.servG.fun_Mensaje('Error: NO DATA');
        }
        l.dismiss();
      },
      (error: any) => {
        l.dismiss();
        this.servG.fun_Mensaje('Error al recuperar los datos');
      }
    );
  }

filtrarClientes() {
  if (this.mostrarTodos) {
    this.listaClientes = this.listaClientesOriginal;
  } else {
    // Mostrar solo los activos (estado 'A')
    this.listaClientes = this.listaClientesOriginal.filter(
      c => c.cli_estado === 'A'
    );
  }

  if (this.listaClientes.length === 0) {
    this.servG.fun_Mensaje('No hay clientes activos');
  }
}


  fun_editar(id: number, ionitemsliding: IonItemSliding) {
    this.servG.irA('/cliente/' + id);
    ionitemsliding.close();
  }

  async fun_eliminar(cliente: any, ionitemsliding: IonItemSliding) {
    ionitemsliding.close();

    let alert = await this.alert.create({
      header: 'Confirmación',
      message:
        '¿Está seguro que desea eliminar el cliente [' +
        cliente.cli_nombre +
        ']?',
      buttons: [
        {
          text: 'Si',
          handler: async () => {
            let l = await this.loading.create({
              message: 'Borrando...',
            });
            l.present();
            this.servC.DesactivarCliente(cliente.cli_id).subscribe((respuesta) => {
                  this.ionViewWillEnter();

              l.dismiss();
              this.servG.fun_Mensaje('Cliente eliminado correctamente');
            }, (error)=>{
              l.dismiss();
              this.servG.fun_Mensaje('Error: ' + error.error.message);  
            }
          );
          },
        },
        {
          text: 'No',
          handler: () => {},
        },
      ],
    });
    alert.present();
  
  }

  
}
