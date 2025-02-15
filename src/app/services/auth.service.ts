import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from 'firebase/auth';
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
  addDoc,
  doc,
  setDoc,
  getDoc,
} from 'firebase/firestore';
import { environment } from 'src/environments/environment';

import { getStorage, ref, getDownloadURL } from 'firebase/storage';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  auth = getAuth();
  app: any;
  db: any;
  storage: any;
  docId = ''; // Reemplaza con el ID que deseas buscar

  constructor() {
    this.app = initializeApp(environment.firebaseConfig);
    this.db = getFirestore(this.app);
    this.storage = getStorage(this.app);
  }

  async login(value) {
    return await signInWithEmailAndPassword(
      this.auth,
      value.email,
      value.password
    );
  }

  session() {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        const uid = user.uid;
        environment.uid = uid;
        localStorage.setItem('uid', uid);
      } else {
      }
    });
  }

  outSession() {
    this.auth.signOut();
  }

  async getURlAPI() {
    const q = query(
      collection(this.db, 'urlAPI'),
      where('nombre', '==', 'web')
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      environment.urlAPI = doc.data().url;
    });
  }

  async getRango() {
    const q = query(
      collection(this.db, 'horarios'),
      where('nombre', '==', 'web')
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      if (doc.id === 'envio_cosecha') {
        environment.horaI = doc.data().limitEMAX;
        environment.horaF = doc.data().limiteMIN;
      }
    });
  }

  async logout() {
    const auth = getAuth();
    try {
      window.location.reload();
      await signOut(auth);
    } catch (error) {}
  }
  async obtenerUrlDescarga(rutaArchivo) {
    const archivoRef = ref(this.storage, rutaArchivo);
    try {
      const url = await getDownloadURL(archivoRef);
      return url;
    } catch (error) {}
  }

  // Guardar datos
  async addSoporte(datos) {
    try {
      const docRef = doc(this.db, 'soporte', localStorage.getItem('uid')); // Definir un ID específico

      await setDoc(docRef, datos);

      console.log('Document written with ID: ', docRef.id);
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  }

  async getDatosFirebase(documento,docId) {

    const docRef = doc(this.db, documento, docId); // Referencia al documento con el ID específico
    const docSnapshot = await getDoc(docRef);

    if (docSnapshot.exists()) {
      localStorage.setItem(docSnapshot.data().key,JSON.stringify(docSnapshot.data().value));
    } else {
      console.log('No such document!');
    }
  }

  
}
