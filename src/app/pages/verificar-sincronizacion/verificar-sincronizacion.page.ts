import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { CosechaService } from 'src/app/services/cosecha.service';
import { RecursosService } from 'src/app/services/recursos.service';
import { LoadingController } from '@ionic/angular';
import { NotificacionesService } from 'src/app/services/notificaciones.service';
@Component({
  selector: 'app-verificar-sincronizacion',
  templateUrl: './verificar-sincronizacion.page.html',
  styleUrls: ['./verificar-sincronizacion.page.scss'],
})
export class VerificarSincronizacionPage implements OnInit {
  fecha: string;
  listaPapeletas:any[] = [];
  listaFichas: any[] = [];
  listRendimeintos: any[] = [];
  papeleta;
  ficha;
  rendimiento;
  constructor(
    private navCtrl: NavController,
    private _cosecha: CosechaService,
    private _recursos:RecursosService,
    private loadingController: LoadingController,
    // private _noti: NotificacionesService
  ) {
    this.fecha = this._recursos.getFechaHoy().fecha;
  }

  ngOnInit() {
    this.getPapeletas();
    this.getFichas();
    this.getRendimientoGaleras();
  }

  getPapeletas() {
    this.listaPapeletas = [];
    document.getElementById('open-loading').click();
    this._cosecha.getBitacoraFecha(this.fecha).subscribe(
      (r: any[])=>{
        this.listaPapeletas = r;
      },(error: any)=>{
        this._recursos.alertaNoti('Error','Conexión de internet','Su conexión de internet es muy mala, compruebe su red y vuelva a intentarlo más tarda !!','custom-alert-header-error')

        // this.detenerLoading();

      }
    );
  }

  getFichas(){
    this.listaFichas = [];
    document.getElementById('open-loading').click();

    this._cosecha.getFichasPublicas(this.fecha).subscribe(
      (r: any[])=>{
        this.listaFichas = r;
        this.detenerLoading();

      },(error: any)=>{
        this._recursos.alertaNoti('Error','Conexión de internet','Su conexión de internet es muy mala, compruebe su red y vuelva a intentarlo más tarda !!','custom-alert-header-error')

        this.detenerLoading();

      }
    );
  }

  getRendimientoGaleras(){
    this.listRendimeintos = [];
    document.getElementById('open-loading').click();

    this._cosecha.getRendimientosGaleras(this.fecha).subscribe(
      (r: any[]) => {
        this.listRendimeintos = r;
        // this._noti.lNotifi({title:'Error',body:'Hola'})
      },(error: any)=>{
        this._recursos.alertaNoti('Error','Conexión de internet','Su conexión de internet es muy mala, compruebe su red y vuelva a intentarlo más tarda !!','custom-alert-header-error')

        // this.detenerLoading();

      }
    );
  }

  navegar(url) {
    this.navCtrl.navigateForward(url);
  }
  async detenerLoading() {
    const loading = await this.loadingController.getTop(); // Obtiene el loading actual
    if (loading) {
      await loading.dismiss(); // Lo cierra
    }
  }
}
