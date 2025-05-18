import { Injectable } from '@angular/core';
import { GeneralService } from './general.service';
import { HttpClient, HttpHeaders  } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  constructor(
    private servG:GeneralService,
    private http:HttpClient
  ) { }

  get_clientes(){
    let url = this.servG.URLSERV + 'clientes';
    const token = localStorage.getItem('token');  // o como guardes el JWT
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<any>(url, { headers });
  }

  get_clientexid(id: number){
    let url = this.servG.URLSERV+'getcliente/'+id;
    const token = localStorage.getItem('token');  // o como guardes el JWT
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    //console.log(url)
    return this.http.get<any>(url);
    }



}//FIN DE LA CLASE
