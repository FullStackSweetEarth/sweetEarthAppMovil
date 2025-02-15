// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // urlAPI: 'http://sweetearthAPI.net',
  // urlAPI: 'https://apiproduccion.sweetearth.com.mx/',
  // urlAPI: 'http://localhost/sweetearthAPI',
  urlAPI: 'https://apidemo.sweetearth.com.mx',
  uid: '',
  appVersion: 'sweetEarth V1.1.4',
  firebaseConfig: {
    apiKey: 'AIzaSyBFHyuZI2zjs8hDWwCh95ohg-VibwQwWR8',
    authDomain: 'sweetearth-97c70.firebaseapp.com',
    databaseURL: 'https://sweetearth-97c70.firebaseio.com',
    projectId: 'sweetearth-97c70',
    storageBucket: 'sweetearth-97c70.appspot.com',
    messagingSenderId: '470723090551',
    appId: '1:470723090551:web:8aa3b83f4c7195c3be4e72',
    measurementId: 'G-PSE8M38JHL'
  },
  fireApp: '',
  versionSistema:'Sweet Earth V1.3.8',
  fechaPagoAvance: '',
  horaI:'07:59',
  horaF:'22:00',
  recargarPlantilla:false,
  backendDowloader: false,
  devMode: true
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
