import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';
import { ClientesService } from 'src/app/servicios/clientes.service';
import { GeneralService } from 'src/app/servicios/general.service';
import { IonicModule, LoadingController, IonItemSliding, AlertController} from '@ionic/angular';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.page.html',
  styleUrls: ['./cliente.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class ClientePage implements OnInit {
id: number = 0;
  clienteActivo: boolean = true; // <-- Nueva propiedad para el checkbox

  objCliente: any = {
    cli_identificacion: '',
    cli_nombre: '',
    cli_telefono: '',
    cli_correo: '',
    cli_direccion: '',
    cli_pais: '',
    cli_ciudad: '',
    cli_estado: '', // Este se llenará con "A" o "I"
  };

  constructor(
    private route: ActivatedRoute,
    private servC: ClientesService,
    private servG: GeneralService,
    private loading: LoadingController
  ) {
    this.id = this.route.snapshot.params['id']
      ? this.route.snapshot.params['id']
      : 0;
    //console.log("Cliente: "+this.id);
  }

  ngOnInit() {}

ionViewWillEnter() {
  if (this.id > 0) {
    this.servC.get_clientexid(this.id).subscribe((respuesta: any) => {
      this.objCliente = respuesta;
      this.clienteActivo = this.objCliente.cli_estado === 'A';
    });
  } else {
    // Nuevo cliente: activar checkbox por defecto
    this.clienteActivo = true;
  }
}


  async fun_grabar() {
    if (this.objCliente.cli_identificacion == '') {
      this.servG.fun_Mensaje('Error: Ingrese la identificacion');
    } else {
      // ✅ Convertir booleano del checkbox al formato esperado
      this.objCliente.cli_estado = this.clienteActivo ? 'A' : 'I'

      let l = await this.loading.create();
      l.present();
      await this.servC.GrabarCliente(this.objCliente).subscribe(
        (respuesta: any) => {
          console.log(respuesta);
          l.dismiss();
          this.servG.fun_Mensaje('Cliente grabado correctamente');
          if (respuesta.id > 0) {
            this.servG.irA('/clientes');
          }
            this.servG.irA('/clientes');
        },
        (error) => {
          l.dismiss();
          this.servG.fun_Mensaje('Error: ' + error.error.message);
        }
      );
    }
  }




}