import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RegisterForm } from '../interfaces/register-form.interfaces';
import { environment } from '../../environment.ts/environmet';
import { LoginForm } from '../interfaces/login-form.interface';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor( private http: HttpClient ) { }



  creandoUsuario( formData: RegisterForm ){

    // peticion http tipo post
    return this.http.post(`${ base_url }/usuarios`, formData );

  }

  login( formData: LoginForm ){

    // peticion http tipo post
    return this.http.post(`${ base_url }/login`, formData );

  }

}
