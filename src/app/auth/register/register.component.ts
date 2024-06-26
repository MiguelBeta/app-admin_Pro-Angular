import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import Swal from 'sweetalert2'

import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {

  // saber si se cargo el fomulario
  public formSubmitted = false;

  public registerForm = this.fb.group({
    nombre:     [ 'Miguel', Validators.required ],
    email:      [ 'total@gmail.com', Validators.email ],
    password:   [ '123456', Validators.required ],
    password2:  [ '123456', Validators.required ],
    terminos:   [ true, Validators.required ],
  }, {
    validators: this.passwordIguales( 'password', 'password2' )
  });

  constructor( private fb: FormBuilder,
               private usuarioService: UsuarioService,
               private router: Router ){ }

  crearUsuario(){

  // Formulario cargado
    this.formSubmitted = true;
    console.log( this.registerForm.value );

    // EL usuarios es invalido?
    if( this.registerForm.invalid ){
      return;
    }

    // Realiza el posteo si es valido y se suscribe a la peticion post realizada desde el servicio
    this.usuarioService.creandoUsuario( this.registerForm.value )
        .subscribe( resp => {
          // console.log(' usuario creado ');
          // console.log( resp );
          // Navega hacia la ruta
          this.router.navigateByUrl('/');

        }, (err) => {
          // Alert si sucede un error
          Swal.fire( 'Error', err.error.msg, 'error' ) ;
        });
  }

  campoNoValido( campo: string ): boolean {
    if ( this.registerForm.get( campo )?.invalid && this.formSubmitted ){
      return true;
    }else{
      return false;
    }
  }

  contrasenaNoValidas(){
    const pass1 = this.registerForm.get('password')?.value;
    const pass2 = this.registerForm.get('password2')?.value;

    if( (pass1 !== pass2) && this.formSubmitted ){
      return true;
    } else{
      return false;
    }


  }

  aceptaTerminos(){
    return !this.registerForm.get('terminos')?.value && this.formSubmitted;
  }

  passwordIguales( pass1Name: string, pass2Name: string ){

    return ( formGroup: FormGroup ) => {

      const pass1Control = formGroup.get(pass1Name);
      const pass2Control = formGroup.get(pass2Name);

      if ( pass1Control?.value === pass2Control?.value ){
        pass2Control?.setErrors(null);
      } else{
        pass2Control?.setErrors({ noEsIgual: true });
      }

    }

  }

}
