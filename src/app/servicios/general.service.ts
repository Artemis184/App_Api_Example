import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {
  proceso: number=2 //1 a local: 2 a web
public URLSERV:string ="";
  constructor( private router:Router,
    private toast:ToastController) {
      if (this.proceso === 1){
        this.URLSERV = "http://localhost:3018/api/";
      }else{
        //this.URLSERV="http://95.216.145.249:3018/api/";
        this.URLSERV="https://app-apiartemis-aq5bcr-978479-95-216-145-249.traefik.me/api/";
      }
     }
    //funciones generales
  irA(url:string){
    this.router.navigateByUrl(url);
  }
 
  //funcion emite mensaje
  async fun_Mensaje(texto: string, tipo: string = 'success') {
    let t = await this.toast.create({
      message: texto,
      color: tipo,
      duration: 3000
    });
    t.present();
  }

  imagenUrl(urlimagen:any){
    let imgurl = "http://95.216.145.249:3018"
    let url= imgurl+urlimagen;
    return url;
  }
}