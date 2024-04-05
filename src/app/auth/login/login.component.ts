import { Component, AfterViewInit, ViewChild, ElementRef, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { LoginForm } from '../../interfaces/login-form.interfaces';
import { response } from 'express';

declare const google: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, AfterViewInit {

  @ViewChild('googleBtn') googleBtn!: ElementRef;

  // saber si se cargo el fomulario
  public formSubmitted = false;

  public loginForm = this.fb.group({
    email: [ localStorage.getItem('email') || '', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    remember: [false]
  });

  constructor( private router: Router,
               private fb: FormBuilder,
               private usuarioService: UsuarioService) { }


  ngOnInit(): void {

  }


  ngAfterViewInit(): void {
    this.googleInit();
  }

  googleInit(){
    google.accounts.id.initialize({
      client_id: '804648329905-reurg2q0hrhiv3tv38t6cb70lf022gm1.apps.googleusercontent.com',
      callback: (response: any) => this.handleCredentialResponse(response)
    });

    google.accounts.id.renderButton(
      // document.getElementById("buttonDiv"),
      this.googleBtn.nativeElement,
      { theme: "outline", size: "large" }  // customization attributes
    );
  }

  handleCredentialResponse( response: any ){
     console.log("Encoded JWT ID token: " + response.credential);
    this.usuarioService.loginGoogle( response.credential )
      .subscribe( resp => {
         console.log({ login: resp });

         // Rediccionar
         this.router.navigateByUrl('/');

      })
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


}
