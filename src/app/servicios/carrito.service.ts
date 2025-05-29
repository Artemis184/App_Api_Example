import { Injectable } from '@angular/core';
import { DetallePedido } from '../interfaces/detalle-pedido';
import { Pedido } from '../interfaces/pedido';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';
import { GeneralService } from './general.service';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  public carrito: DetallePedido[] = [];
  public pedidoActual: Pedido | null = null;
  private baseUrl = this.servG.URLSERV; // Cambia por tu URL real

  constructor(private servG: GeneralService, private http: HttpClient) { }

  crearPedido(cli_id: number, usr_id: number): Pedido {
    const nuevoPedido: Pedido = {
      ped_id: Date.now(), // usar timestamp como ID temporal
      cli_id,
      usr_id,
      ped_fecha: new Date(),
      ped_estado: false,
    };
    this.pedidoActual = nuevoPedido;
    this.carrito = [];
    return nuevoPedido;
  }

  obtenerCarrito(): DetallePedido[] {
    return this.carrito;
  }

  agregarProducto(producto: DetallePedido): void {
    const index = this.carrito.findIndex(item => item.prod_id === producto.prod_id);
    if (index !== -1) {
      this.carrito[index].det_cantidad += producto.det_cantidad;
    } else {
      this.carrito.push(producto);
    }
  }

  fun_Mensaje(msg: string) {
    alert(msg);
  }


actualizarCarrito(nuevoCarrito: DetallePedido[]) {
  this.carrito = [...nuevoCarrito];
}

guardarPedido(
  pedido: Omit<Pedido, 'ped_id'>,
  detalles: Omit<DetallePedido, 'det_id' | 'ped_id'>[]
): Observable<any> {
  const token = localStorage.getItem('token'); // o como guardes tu JWT
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  });

  // Paso 1: guardar el pedido y obtener ped_id
  return this.http.post<{ ped_id: number }>(
    `${this.baseUrl}pedidos`,
    pedido,
    { headers } // <-- usar headers aquí
  ).pipe(
    switchMap(({ ped_id }) => {
      // Paso 2: guardar detalles del pedido con el ped_id
      const detallesConPedido = detalles.map(det => ({ ...det, ped_id }));
      return this.http.post(
        `${this.baseUrl}pedidosdetalle`,
        detallesConPedido,
        { headers } // <-- usar headers aquí también
      );
    })
  );
}



}


