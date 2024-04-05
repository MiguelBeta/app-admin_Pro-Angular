import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, tap } from "rxjs/operators";

import { environment } from '../../environment.ts/environmet';

import { RegisterForm } from '../interfaces/register-form.interfaces';
import { LoginForm } from '../interfaces/login-form.interfaces';
import { Observable, of } from 'rxjs';
import { error } from 'node:console';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor( private http: HttpClient ) { }

  validarToken(): Observable <boolean> {
    const token = localStorage.getItem('token') || '';

    return this.http.get(`${ base_url }/login/renew`, {
      headers: {
        'x-token': token
      }
    }).pipe(
      tap ( (resp: any) => {
        localStorage.setItem( 'token', resp.token );
      }),
      map( resp => true ),
      catchError( error => of(false) )
      );

  }



  creandoUsuario( formData: RegisterForm ){

    // peticion http tipo post
    return this.http.post(`${ base_url }/usuarios`, formData )
              .pipe(
                tap( ( resp: any ) => {
                  localStorage.setItem('token', resp.token)
                })
              )

  }

  login( formData: LoginForm ){

    // peticion http tipo post
    return this.http.post(`${ base_url }/login`, formData )
               .pipe(
                  tap( ( resp: any ) => {
                    localStorage.setItem('token', resp.token)
                  })
                )

  }

  loginGoogle( token: string ){
    return this.http.post(`${ base_url }/login/google`, { token })
      .pipe(
        tap( ( resp: any ) => {
           console.log(resp)
          localStorage.setItem( 'token', resp.token )
        })
      )
  }

}
