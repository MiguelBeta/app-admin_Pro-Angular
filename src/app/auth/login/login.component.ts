import { Component } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { LoginForm } from '../../interfaces/login-form.interfaces';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  // saber si se cargo el fomulario
  public formSubmitted = false;

  public loginForm = this.fb.group({
    email: [ localStorage.getItem('email') || '', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    remember: [false]
  });

  constructor(private router: Router,
    private fb: FormBuilder,
    private usuarioService: UsuarioService) { }


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

    }, (err) => {
      // Alert si sucede un error
      Swal.fire('Error', err.error.msg, 'error');
    });



}


}
