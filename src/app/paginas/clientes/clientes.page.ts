import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
    this.ionViewWillEnter();
  }

  ionViewWillEnter() {
    this.cargarClientes();
  }

  async cargarClientes() {
    const l = await this.loading.create({ message: 'Cargando clientes...' });
    await l.present();

    try {
      const respuesta = await this.servC.get_clientes();

      // La respuesta ya es un array, así que solo parseamos si es string
      this.listaClientesOriginal =
        typeof respuesta.data === 'string'
          ? JSON.parse(respuesta.data)
          : respuesta.data;

      console.log('Clientes recibidos:', this.listaClientesOriginal);

      if (this.listaClientesOriginal.length > 0) {
        this.filtrarClientes(); // Aplica filtro de mostrarTodos
      } else {
        this.listaClientes = [];
        this.servG.fun_Mensaje('Error: NO DATA');
      }
    } catch (error: any) {
      console.error('Error al recuperar los datos:', error);
      this.servG.fun_Mensaje(
        'Error: ' + (error?.message || JSON.stringify(error))
      );
    } finally {
      l.dismiss();
    }
  }

  filtrarClientes() {
    if (this.mostrarTodos) {
      this.listaClientes = this.listaClientesOriginal;
    } else {
      // Mostrar solo los activos (estado 'A')
      this.listaClientes = this.listaClientesOriginal.filter(
        (c) => c.cli_estado === 'A'
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

    const alert = await this.alert.create({
      header: 'Confirmación',
      message:
        '¿Está seguro que desea eliminar el cliente [' +
        cliente.cli_nombre +
        ']?',
      buttons: [
        {
          text: 'Si',
          handler: async () => {
            const l = await this.loading.create({
              message: 'Borrando...',
            });
            await l.present();

            try {
              const respuesta = await this.servC.DesactivarCliente(
                cliente.cli_id
              );

              this.ionViewWillEnter();
              this.servG.fun_Mensaje('Cliente eliminado correctamente');
            } catch (error: any) {
              this.servG.fun_Mensaje('Error: ' + (error?.message || error));
            } finally {
              l.dismiss();
            }
          },
        },
        {
          text: 'No',
          handler: () => {},
        },
      ],
    });

    await alert.present();
  }
}
