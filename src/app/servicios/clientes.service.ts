import { Injectable } from '@angular/core';
import { GeneralService } from './general.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Http } from '@capacitor-community/http';

@Injectable({
  providedIn: 'root',
})
export class ClientesService {
  constructor(private servG: GeneralService, private http: HttpClient) {}

  async get_clientes() {
    let url = this.servG.URLSERV + 'clientes';
    const token = localStorage.getItem('token'); // o como guardes el JWT
    const options = {
      url: url,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await Http.get(options);
      return response.data;
    } catch (error) {
      console.error;
      throw error;
    }
  }

  async get_clientexid(id: number) {
    let url = this.servG.URLSERV + 'getcliente/' + id;
    const token = localStorage.getItem('token'); // o como guardes el JWT
    const options = {
      url: url,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await Http.get(options);
      return response.data;
    } catch (error) {
      console.error;
      throw error;
    }
  }

  async GrabarCliente(objCliente: any) {
    const token = localStorage.getItem('token');

    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json', // 👈 este es el que faltaba
    };

    try {
      if (objCliente.cli_id > 0) {
        // update
        const url = this.servG.URLSERV + 'putcliente/' + objCliente.cli_id;
        const response = await Http.put({
          url,
          headers,
          data: objCliente,
        });
        return response;
      } else {
        // insert
        const url = this.servG.URLSERV + 'postcliente/';
        const response = await Http.post({
          url,
          headers,
          data: objCliente,
        });
        return response;
      }
    } catch (error) {
      console.error('Error en GrabarCliente:', error);
      throw error;
    }
  }

  async BorrarCliente(id: number) {
    const token = localStorage.getItem('token'); // o como guardes el JWT

<<<<<<< HEAD
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json', // 👈 este es el que faltaba
    };

    try {
      const url = this.servG.URLSERV + 'deletecliente/' + id;
      const response = await Http.del({
        url,
        headers,
      });
      return response;
    } catch (error) {
      console.error('Error en BorrarCliente:', error);
      throw error;
    }
  }

  async DesactivarCliente(id: number) {
    const token = localStorage.getItem('token'); // o como guardes el JWT

    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json', // 👈 este es el que faltaba
    };

    try {
      const url = this.servG.URLSERV + 'patchcliente/' + id;
      const response = await Http.patch({
        url,
        headers,

        data: { cli_estado: 'I' },
      });
      return response;
    } catch (error) {
      console.error('Error en DesactivarCliente:', error);
      throw error;
    }
  }
}
=======
} //FIN DE LA CLASE
>>>>>>> prueba
