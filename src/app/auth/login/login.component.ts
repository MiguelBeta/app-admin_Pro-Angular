import { Component } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  // saber si se cargo el fomulario
  public formSubmitted = false;

  public loginForm = this.fb.group({
    email:    ['total@gmail.com', Validators.email],
    password: ['123456', Validators.required],
    remember: [ false ] ,

  });

  constructor(  private router: Router,
                private fb: FormBuilder,
                private usuarioService: UsuarioService ) { }

  login(){

    // console.log( this.loginForm.value );
    this.usuarioService.login( this.loginForm.value )
      .subscribe( resp => {
      console.log(resp)
      }, (err) => {
        // Alert si sucede un error
        Swal.fire( 'Error', err.error.msg, 'error' ) ;
      });


  }


}
