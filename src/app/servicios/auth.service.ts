import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { GeneralService } from './general.service';

interface LoginResponse {
  token: string;
}

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  constructor(private http: HttpClient,
              private servG: GeneralService

  ) {}

  login(usuario: string, clave: string): Observable<LoginResponse> {
    let url = this.servG.URLSERV + 'login';

    return this.http.post<LoginResponse>(url, {
      usr_usuario: usuario,
      usr_clave: clave
    }).pipe(
      tap(response => {
        if (response.token) {
          this.setToken(response.token);
        }
      }),
      catchError(this.handleError)
    );
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Decodifica el payload JWT para extraer información
  getDecodedToken(): any | null {
    const token = this.getToken();
    if (!token) {
      return null;
    }
    try {
      const payload = token.split('.')[1];
      const decodedPayload = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(decodedPayload);
    } catch (e) {
      console.error('Error al decodificar token JWT', e);
      return null;
    }
  }

  // Valida si el token JWT está expirado
  isTokenExpired(): boolean {
    const decoded = this.getDecodedToken();
    if (!decoded || !decoded.exp) {
      return true; // si no tiene expiración, considerar inválido
    }
    const expirationDate = new Date(decoded.exp * 1000); // exp en segundos
    return expirationDate < new Date();
  }

  // Verifica si está autenticado y el token es válido
  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired();
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Error en AuthService:', error);
    return throwError(() => new Error('Error en la autenticación, intenta nuevamente'));
  }
}