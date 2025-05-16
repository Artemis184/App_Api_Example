import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import{IonicModule, LoadingController, IonItemSliding} from '@ionic/angular'
import { ClientesService } from 'src/app/servicios/clientes.service';
import { GeneralService } from 'src/app/servicios/general.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.page.html',
  styleUrls: ['./clientes.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ClientesPage implements OnInit {
  listaClientes: any[]=[];
  objectoRespuesta:any;

  constructor(
    private servC: ClientesService,
    private loading: LoadingController,
    public servG: GeneralService
  ) { }

  ngOnInit() {
    this.cargarClientes();
  }



  async cargarClientes(){
    let l = await this.loading.create();
    l.present();
    this.servC.get_clientes().subscribe(
      (respuesta:any)=>{
        //console.log(JSON.stringify(respuesta))
        //console.log(respuesta)
        this.objectoRespuesta=respuesta;
        //console.log(this.objectoRespuesta)
        if(this.objectoRespuesta.cant>0){
          this.listaClientes=this.objectoRespuesta.data;
          console.log(this.listaClientes);
          l.dismiss();
        }else{
          console.log("NO existe datos")
          this.servG.fun_Mensaje("error: NO DATA")
        }
        //console.log(this.listaClientes[0])

      },(error:any)=>{
        l.dismiss();
        this.servG.fun_Mensaje("Erorr al recuperar lo datos")
      }
    );
  }



  fun_editar(id:number, ionitemsliding: IonItemSliding){
    //console.log('editar:'+ id)
    this.servG.irA('/cliente/'+id);
    ionitemsliding.close();

  }

  fun_eliminar(id:number, ionitemsliding: IonItemSliding){
    console.log('borrar:'+ id)
    ionitemsliding.close();
  }

}
