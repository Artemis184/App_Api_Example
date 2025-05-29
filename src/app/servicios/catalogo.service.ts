import { Injectable } from '@angular/core';
import { GeneralService } from './general.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

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
  formData.append('prod_imagen', file);

  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`,
  });

  try {
    const response: any = await firstValueFrom(this.http.patch(url, formData, { headers }));
    return response; // ✅ devuelve el producto actualizado, incluyendo la imagen
  } catch (error) {
    console.error('Error en subir_imagen:', error);
    throw error;
  }
}


buscar_productos(texto: string) {
  const url = `${this.servG.URLSERV}productos/buscar?texto=${encodeURIComponent(texto)}`;
  const headers = new HttpHeaders({
    Authorization: `Bearer ${localStorage.getItem('token') || ''}`
  });

  return this.http.get<any>(url, { headers });
}



} 
