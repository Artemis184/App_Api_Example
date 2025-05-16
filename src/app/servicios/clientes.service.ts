import { Injectable } from '@angular/core';
import { GeneralService } from './general.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  constructor(
    private servG:GeneralService,
    private http:HttpClient
  ) { }

  get_clientes(){
    let url = this.servG.URLSERV+'clientes'

    //console.log(url)
    return this.http.get<any>(url);
  }


  get_clientexid(id: number){
    let url = this.servG.URLSERV+'getcliente/'+id;

    //console.log(url)
    return this.http.get<any>(url);
    }



}//FIN DE LA CLASE
