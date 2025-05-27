import { Injectable } from '@angular/core';
import { GeneralService } from './general.service';
import { Http } from '@capacitor-community/http';

interface LoginResponse {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private servG: GeneralService) {}

async login(usuario: string, clave: string): Promise<void> {
  const url = this.servG.URLSERV + 'login';

  const options = {
    url,
    headers: {
      'Content-Type': 'application/json'
    },
    params: {}, // <- 👈 esto evita el NullPointerException
    data: {
      usr_usuario: usuario,
      usr_clave: clave
    }
  };

  try {
    const response = await Http.post(options);
    const token = response?.data?.token;
    if (token) {
      this.setToken(token);
    } else {
      throw new Error('Token no recibido');
    }
  } catch (error) {
    console.error('Error en AuthService login:', error);
    throw error;
  }
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

  getDecodedToken(): any | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = token.split('.')[1];
      const decodedPayload = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(decodedPayload);
    } catch (e) {
      console.error('Error al decodificar token JWT', e);
      return null;
    }
  }

  isTokenExpired(): boolean {
    const decoded = this.getDecodedToken();
    if (!decoded || !decoded.exp) return true;
    const expirationDate = new Date(decoded.exp * 1000);
    return expirationDate < new Date();
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired();
  }
<<<<<<< HEAD
}
=======

  private handleError(error: HttpErrorResponse) {
    console.error('Error en AuthService:', error);
    return throwError(() => new Error('Error en la autenticación, intenta nuevamente'));
  }
}
>>>>>>> prueba
