import { Injectable } from '@angular/core';
import { GeneralService } from './general.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Http } from '@capacitor-community/http';

@Injectable({
  providedIn: 'root',
})
export class CatalogoService {
  constructor(private servG: GeneralService, private http: HttpClient) {}

  async get_productos() {
    const url = this.servG.URLSERV + 'productos';
    const token = localStorage.getItem('token'); // o como guardes el JWT

    const options = {
      url: url,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await Http.get(options);
      // response.data contiene el cuerpo de la respuesta
      return response.data;
    } catch (error) {
      console.error('Error en get_productos:', error);
      throw error;
    }
  }

  async subir_imagen(file: File, prod_id: number) {
    const url = `${this.servG.URLSERV}productoputima/${prod_id}`;
    const token = localStorage.getItem('token');

    const formData = new FormData();
    formData.append('prod_imagen', file); // <== nombre debe coincidir con multer

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      // NO incluir Content-Type, FormData lo maneja
    });

    try {
      const response = await this.http
        .patch(url, formData, { headers })
        .toPromise();
      return response;
    } catch (error) {
      console.error('Error en subir_imagen:', error);
      throw error;
    }
  }
}
