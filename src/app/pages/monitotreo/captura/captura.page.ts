import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { async } from '@angular/core/testing';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
@Component({
  selector: 'app-captura',
  templateUrl: './captura.page.html',
  styleUrls: ['./captura.page.scss'],
})
export class CapturaPage implements OnInit {
  ngOnInit(): void {
    // throw new Error('Method not implemented.');
    // this.startScan();
  }
  @ViewChild('cameraView', { static: false }) cameraView!: ElementRef;

  async startScan() {
    // Oculta la interfaz para una experiencia más inmersiva
    document.body.classList.add('scanner-active');

    await BarcodeScanner.checkPermission({ force: true });

    BarcodeScanner.hideBackground(); // Oculta la vista web para superponer la cámara

    const result = await BarcodeScanner.startScan(); // Inicia el escaneo

    if (result.hasContent) {
      console.log('Código escaneado:', result.content);
      alert('Código escaneado: ' + result.content);
    }

    this.stopScan();
  }

  stopScan() {
    BarcodeScanner.stopScan();
    document.body.classList.remove('scanner-active');
  }
}
