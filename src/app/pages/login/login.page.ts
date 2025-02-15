import { Component, OnInit } from '@angular/core';

import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NavController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  validations_form: FormGroup;
  errorMessage: string = '';
  cargando = false;
  constructor(
    private navCtrl: NavController,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    public modalController: ModalController
  ) {
  }

  ngOnInit() {
    this.validations_form = this.formBuilder.group({
      email: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
        ])
      ),
      password: new FormControl(
        '',
        Validators.compose([Validators.minLength(5), Validators.required])
      ),
    });
  }
  validation_messages = {
    email: [
      { type: 'required', message: 'Email is required.' },
      { type: 'pattern', message: 'Please enter a valid email.' },
    ],
    password: [
      { type: 'required', message: 'Password is required.' },
      {
        type: 'minlength',
        message: 'Password must be at least 5 characters long.',
      },
    ],
  };
  loginUser(value) {
    this.cargando = true;
    this.authService.login(value).then(
      (res: any) => {
        localStorage.setItem('user', res.user.refreshToken);
        this.errorMessage = '';
        setTimeout(() => {
        }, 1000);
        this.navCtrl.navigateForward('menu');
        this.cargando = false;
      },
      (err) => {
        this.cargando = false;
        this.errorMessage = this.getErrorMessage(err.code);
      }
    );
  }
  // Función para traducir los errores de Firebase
getErrorMessage(errorCode: string): string {
  const errores: { [key: string]: string } = {
    'auth/invalid-email': 'El correo electrónico no es válido.',
    'auth/user-disabled': 'Esta cuenta ha sido deshabilitada.',
    'auth/user-not-found': 'No se encontró una cuenta con este correo.',
    'auth/wrong-password': 'La contraseña es incorrecta.',
    'auth/too-many-requests': 'Demasiados intentos. Inténtalo más tarde.',
    'auth/network-request-failed': 'Error de conexión. Verifica tu internet.',
  };

  return errores[errorCode] || 'Error desconocido. Inténtalo nuevamente.';
}
  goToRegisterPage() {
    this.navCtrl.navigateForward('/register');
  }
}
