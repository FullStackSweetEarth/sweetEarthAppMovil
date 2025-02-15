import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  where,
} from 'firebase/firestore';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ReporteErroresService {
  app: any;
  db: any;

  constructor() {
    this.app = initializeApp(environment.firebaseConfig);
    this.db = getFirestore(this.app);
  }

  async registrarError(detalles, modulo) {
    const error = {
      detalles: detalles,
      uid: environment.uid,
      modulo: modulo,
      fecha: new Date(),
      fechaBuscar: new Date().toISOString().split('T')[0],
      status: 0,
      version: 'Móvil',
      vSistema: environment.versionSistema
    };
    const docRef = await addDoc(collection(this.db, 'reporte-errores'), error);
  }

  async getRegistrosErrores() {
    const q = query(collection(this.db, 'reporte-errores'));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
    });
  }
}
