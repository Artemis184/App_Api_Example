import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';
import { ClientesService } from 'src/app/servicios/clientes.service';
import{IonicModule, LoadingController} from '@ionic/angular'

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.page.html',
  styleUrls: ['./cliente.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ClientePage implements OnInit {
  id: number = 0;
  objCliente: any = {
 cli_identificacion: "",
 cli_nombre: "",
 cli_telefono: "",
 cli_correo: "",
 cli_direccion: "",
 cli_pais: "",
 cli_ciudad: ""   
}

  constructor(
    private route: ActivatedRoute,
    private servC:ClientesService
  ) { 
    this.id=this.route.snapshot.params["id"]?this.route.snapshot.params["id"]:0;
    //console.log("Cliente: "+this.id);
  }

  ngOnInit() {
  }

  ionViewWillEnter(){
    if (this.id>0){
      //RECUPERAR LOS DATOS DEL CLIENTE CON EL ID
      this.servC.get_clientexid(this.id).subscribe(
        (respuesta:any)=>{
          this.objCliente=respuesta;
          console.log(this.objCliente);
        }
      )


    }else{
      console.log("nuevo cliente")
    }
  }

}
