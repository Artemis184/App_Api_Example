import { Injectable } from '@angular/core';
import { GeneralService } from './general.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ClientesService {
  constructor(private servG: GeneralService, private http: HttpClient) {}

  get_clientes() {
    let url = this.servG.URLSERV + 'clientes';
    const token = localStorage.getItem('token'); // o como guardes el JWT
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<any>(url, { headers });
  }

  get_clientexid(id: number) {
    let url = this.servG.URLSERV + 'getcliente/' + id;
    const token = localStorage.getItem('token'); // o como guardes el JWT
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    //console.log(url)
    return this.http.get<any>(url, { headers });
  }

  GrabarCliente(objCliente: any) {
    if (objCliente.cli_id > 0) {
      //update
      let url = this.servG.URLSERV + 'putcliente/' + objCliente.cli_id;
      const token = localStorage.getItem('token'); // o como guardes el JWT
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });
      //console.log(url)
      return this.http.put<any>(url, objCliente, { headers });
    } else {
      let url = this.servG.URLSERV + 'postcliente/';
      const token = localStorage.getItem('token'); // o como guardes el JWT
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });
      //console.log(url)
      return this.http.post<any>(url, objCliente, { headers });

      //insert
    }
  }


  
  BorrarCliente(id:number){
    let url = this.servG.URLSERV + 'deletecliente/' + id;
      const token = localStorage.getItem('token'); // o como guardes el JWT
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });
      return this.http.delete<any>(url, { headers });

    }


  DesactivarCliente(id: number) {
    const url = this.servG.URLSERV + 'patchcliente/' + id;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const body = { cli_estado: 'I' };

    return this.http.patch<any>(url, body, { headers });
  }


} //FIN DE LA CLASE