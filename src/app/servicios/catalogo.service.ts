import { Injectable } from '@angular/core';
import { GeneralService } from './general.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class CatalogoService {

  constructor(
      private servG:GeneralService,
    private http:HttpClient,
  ) { }


  get_productos(){
  let url = this.servG.URLSERV+"productos";
    const token = localStorage.getItem('token'); // o como guardes el JWT
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

  console.log(url);

  return this.http.get<any>(url,  { headers });
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
        .patch(url, formData, { headers });
        return response;
    } catch (error) {
      console.error('Error en subir_imagen:', error);
      throw error;
    }
  }

} 