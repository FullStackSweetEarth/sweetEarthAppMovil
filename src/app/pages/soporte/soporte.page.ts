import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { RecursosService } from 'src/app/services/recursos.service';
// import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { File } from '@awesome-cordova-plugins/file/ngx';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-soporte',
  templateUrl: './soporte.page.html',
  styleUrls: ['./soporte.page.scss'],
})
export class SoportePage implements OnInit {
  localStorageKeys = [];
  palabra:'';

  // Recorrer todas las claves en localStorage y añadirlas al array

  constructor(private _recursos: RecursosService, private navCtrl: NavController, private file: File, private _auth: AuthService) {}

  ngOnInit() {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      let value = localStorage.getItem(key);

      // Intentar convertir el valor a su forma original si es JSON o array
      try {
        value = JSON.parse(value);
      } catch (e) {
        // Si no es JSON, mantener el valor como cadena de texto
      }
      this.localStorageKeys.push({ key, value });
    }
    console.log(this.localStorageKeys);
  }



  copyJsonToClipboard(data) {
  // Convertir el JSON a una cadena
  const jsonString = JSON.stringify(data, null, 2);
  
  this._auth.addSoporte(data).then((r: any)=>{
  });
  navigator.clipboard.writeText(jsonString)
    .then(() => {
      this._recursos.toastM('bottom','Dato guardado en papelera', 2000)
    })
    .catch(err => {
      console.error("Error al copiar JSON al portapapeles:", err);
    });
}
async saveJsonAsTxt(jsonString: string, fileName: string) {

  this.file.writeFile(this.file.dataDirectory, `${fileName}.txt`, jsonString, { replace: true })
    .then(() => console.log('Archivo guardado exitosamente'))
    .catch(err => console.error('Error al guardar el archivo', err));
}


navegar(url){
  this.navCtrl.navigateForward(url);
}
}
