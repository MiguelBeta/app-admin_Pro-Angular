import { Component, AfterViewInit, OnInit, NgZone } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { LoginForm } from '../../interfaces/login-form.interfaces';
import { response } from 'express';

declare const google: any;
declare const gapi:any;


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  // @ViewChild('googleBtn') googleBtn!: ElementRef;

  // saber si se cargo el fomulario
  public formSubmitted = false;
  public auth2: any;


  public loginForm = this.fb.group({
    email: [ localStorage.getItem('email') || '', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    remember: [false]
  });

  constructor( private router: Router,
               private fb: FormBuilder,
               private usuarioService: UsuarioService,
               private ngZone: NgZone ) { }


  ngOnInit(): void {
    this.renderButton();
  }



login() {

  // Obtener los valores del formulario
  const email = this.loginForm.value.email ?? '';
  const password = this.loginForm.value.password;
  const remember = this.loginForm.value.remember;

  // Verificar si los valores son nulos o indefinidos
  const formData: LoginForm = {
    email: this.loginForm.get('email')?.value ?? '',
    password: this.loginForm.get('password')?.value ?? '',
    remember: this.loginForm.get('remember')?.value ?? false
  };

  // Llamar el metodo login del servicio
  this.usuarioService.login(formData)
    .subscribe(resp => {
      if( formData.remember ) {
        localStorage.setItem('email', formData.email);
        } else {
          localStorage.removeItem('email');
        }

      // Navegar al Dashboard
      this.router.navigateByUrl('/');

    }, (err) => {
      // Alert si sucede un error
      Swal.fire('Error', err.error.msg, 'error');
    });



}

renderButton() {
  gapi.signin2.render('my-signin2', {
    'scope': 'profile email',
    'width': 240,
    'height': 50,
    'longtitle': true,
    'theme': 'dark',
  });

  this.startApp();

}

async startApp() {

  await this.usuarioService.googleInit();
  this.auth2 = this.usuarioService.auth2;

  this.attachSignin( document.getElementById('my-signin2') );

};

attachSignin( element: HTMLElement | null ) {

  if (!element) {
    console.error("Element with ID 'my-signin2' not found.");
    return;
  }

  this.auth2.attachClickHandler( element, {},
      ( googleUser: any ) => {
          const id_token = googleUser.getAuthResponse().id_token;
          // console.log(id_token);
          this.usuarioService.loginGoogle( id_token )
            .subscribe( resp => {
              // Navegar al Dashboard
              this.ngZone.run( () => {
                this.router.navigateByUrl('/');
              })
            });

      }, ( error: any ) => {
          alert(JSON.stringify(error, undefined, 2));
      });
}


}
