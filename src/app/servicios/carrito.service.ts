import { Injectable } from '@angular/core';
import { DetallePedido } from '../interfaces/detalle-pedido';
import { Pedido } from '../interfaces/pedido';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, switchMap, forkJoin } from 'rxjs';
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
      cli_id,
      usr_id,
      ped_fecha: this.formatearFecha(new Date()),
      ped_estado: true,
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

guardarPedidoYDetalles(): Observable<any> {
  if (!this.pedidoActual) {
    this.fun_Mensaje("No hay pedido actual para guardar");
    return new Observable<void>(observer => observer.complete());
  }

  const token = localStorage.getItem('token') || '';
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  });

  // Creamos el pedido (sin ped_id)
  const pedidoParaCrear: Omit<Pedido, 'ped_id'> = {
    cli_id: this.pedidoActual.cli_id,
    usr_id: this.pedidoActual.usr_id,
    ped_fecha: this.formatearFecha(new Date()),
    ped_estado: this.pedidoActual.ped_estado,
  };

  // POST pedido
  return this.http.post<Pedido>(`${this.baseUrl}pedidos`, pedidoParaCrear, { headers }).pipe(
    switchMap((pedidoCreado) => {
      if (!pedidoCreado.ped_id) {
        throw new Error("No se recibió ped_id al crear pedido");
      }
      // Ahora insertamos detalles, asignando ped_id real
      const detallesConPedido = this.carrito.map(det => ({
        prod_id: det.prod_id,
        det_cantidad: det.det_cantidad,
        det_precio: det.det_precio,
        ped_id: pedidoCreado.ped_id,
      }));

      // Hacer POST para cada detalle y esperar a que terminen todos
      const detallesObs = detallesConPedido.map(det =>
        this.http.post(`${this.baseUrl}pedidosdetalle`, det, { headers })
      );

      // Esperar a que todos los POST detalles finalicen
      return forkJoin(detallesObs);
    })
  );
}

private formatearFecha(fecha: Date): string {
  const yyyy = fecha.getFullYear();
  const mm = String(fecha.getMonth() + 1).padStart(2, '0');
  const dd = String(fecha.getDate()).padStart(2, '0');
  const hh = String(fecha.getHours()).padStart(2, '0');
  const min = String(fecha.getMinutes()).padStart(2, '0');
  const ss = String(fecha.getSeconds()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`; // ✅ Aceptado por MySQL
}



}


