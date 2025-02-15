import { Component, OnInit } from '@angular/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { NavController } from '@ionic/angular';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { AsyncService } from 'src/app/services/async.service';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';
export interface IItems {
  id: number,
  nombre: string,
  icon: string,
  router?:string,
  url?: string,
  icono?: string
}
@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {
  items: IItems[] = [];
  itemsV2: any[] = [];
  auth = getAuth();
  est = false;
  devmode = environment.devMode;
  uidUser = '';
  constructor(private navCtrl: NavController, private _async: AsyncService, private _auth: AuthService) { 
    
  }

  async ngOnInit() {
    this.est = environment.backendDowloader;
    const setStatusBar = async () => {
      await StatusBar.setBackgroundColor({ color: '#12876B' }); await StatusBar.setStyle({ style: Style.Dark });
    };
    setStatusBar();
    const c = await onAuthStateChanged(this.auth, (user) => {
      if (user) {
        const uid = user.uid;
        environment.uid = uid;
      } else {
        this.navCtrl.navigateForward('/login');
      }
    });
    this.getMenu();
  }

  getMenu(){
    setTimeout(() => {
      
      if(this._async.getData('menu').length >0){
        this.items = this._async.getData('menu');
        this.itemsV2 = this._async.getData('menuV2');
      }else{
        this.getMenu();
      }
    }, 200);
  }
  navegar(url){
    this.navCtrl.navigateForward(url);
  }
  salir(){
    this.auth.signOut();
  }

  getDatosFire(){
    this._auth.getDatosFirebase('soporte',this.uidUser );
  }

}
