import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/servicios/auth.service';
import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonInput, IonItem, IonList, IonLabel, IonButton
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar,
    IonInput, IonItem, IonList, IonLabel, IonButton,
    CommonModule, FormsModule
  ]
})
export class LoginPage {
  usuario = '';
  clave = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.authService.login(this.usuario, this.clave).subscribe({
      next: () => {
        this.router.navigate(['/principal']); // o a la página principal
      },
      error: () => {
        alert('Credenciales inválidas');
      }
    });
  }
}
