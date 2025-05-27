import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { StatusBar, Style } from '@capacitor/status-bar';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  constructor() {  this.initializeApp();
  }

  async initializeApp() {
    try {
      // Asegura que la status bar no tape el contenido
      await StatusBar.setOverlaysWebView({ overlay: false });

      // Opcional: color personalizado
      await StatusBar.setBackgroundColor({ color: '#ffffff' });

      // Opcional: estilo de íconos (dark o light)
      await StatusBar.setStyle({ style: Style.Dark });
    } catch (err) {
      console.error('Error al configurar StatusBar', err);
    }
  }
}