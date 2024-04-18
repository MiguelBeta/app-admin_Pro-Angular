import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, tap } from "rxjs/operators";
import { Router } from '@angular/router';

import { environment } from '../../environment.ts/environmet';

import { RegisterForm } from '../interfaces/register-form.interfaces';
import { LoginForm } from '../interfaces/login-form.interfaces';
import { Observable, of } from 'rxjs';
import { error } from 'node:console';

import { Usuario } from '../models/usuario.model';


declare const google: any;

const base_url = environment.base_url;
declare const gapi: any;


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public auth2: any;
  private isAuth2Initialized: boolean = false;
  public usuario?: Usuario;

  constructor( private http: HttpClient,
               private router: Router,
               private ngZone: NgZone ) {

    document.addEventListener('DOMContentLoaded', () => {
      this.googleInit();
    });
    // this.googleInit();
  }

  googleInit(){

    return new Promise<void>( resolve => {

      gapi.load('auth2', () => {
      this.auth2 = gapi.auth2.init({
        client_id: '804648329905-reurg2q0hrhiv3tv38t6cb70lf022gm1.apps.googleusercontent.com',
        cookiepolicy: 'single_host_origin',
      });

      resolve();
    });
  })

  }

  logout(){

    localStorage.removeItem('token');

    this.auth2.signOut().then( () => {

      this.ngZone.run( () => {
        this.router.navigateByUrl('/login');
      })
    });

  }

  // googleInit() {

  //   return new Promise <void> ( resolve => {
  //     gapi.load('auth2', () => {
  //       this.auth2 = gapi.auth2.init({
  //         client_id: '1045072534136-oqkjcjvo449uls0bttgvl3aejelh22f5.apps.googleusercontent.com',
  //         cookiepolicy: 'single_host_origin',
  //       });

  //       resolve();
  //     });
  //   })

  // }

  validarToken(): Observable <boolean> {
    const token = localStorage.getItem('token') || '';

    return this.http.get(`${ base_url }/login/renew`, {
      headers: {
        'x-token': token
      }
    }).pipe(
      map ( (resp: any) => {
        const { email, google, nombre, role, img = '', uid } = resp.usuario;
        this.usuario = new Usuario( nombre, email, '', img, google, role, uid );
        localStorage.setItem( 'token', resp.token );
        return true;
      }),
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
