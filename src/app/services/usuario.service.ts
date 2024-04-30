import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { catchError, map, tap } from "rxjs/operators";
import { Observable, of } from 'rxjs';

import { environment } from '../../environment.ts/environmet';
import { RegisterForm } from '../interfaces/register-form.interfaces';
import { LoginForm } from '../interfaces/login-form.interfaces';
import { CargarUsuario } from '../interfaces/cargar-usuarios.interfaces';
// import { error } from 'node:console';

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

  constructor(private http: HttpClient,
    private router: Router,
    private ngZone: NgZone) {

    document.addEventListener('DOMContentLoaded', () => {
      this.googleInit();
    });
    // this.googleInit();
  }


  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get role(): 'ADMIN_ROLE' | 'USER_ROLE' {
    return this.usuario?.role || 'USER_ROLE';
  }

  get uid(): string {
    return this.usuario?.uid || '';
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token
      }
    }
  }

  googleInit() {

    return new Promise<void>(resolve => {

      gapi.load('auth2', () => {
        this.auth2 = gapi.auth2.init({
          client_id: '804648329905-reurg2q0hrhiv3tv38t6cb70lf022gm1.apps.googleusercontent.com',
          cookiepolicy: 'single_host_origin',
        });

        resolve();
      });
    })

  }

  guardarLocalStorage(token: string, menu: any) {

    localStorage.setItem('token', token);
    // Mostrar el menu
    localStorage.setItem('menu', JSON.stringify(menu));
  }

  logout() {

    localStorage.removeItem('token');
    localStorage.removeItem('menu');

    this.auth2.signOut().then(() => {

      this.ngZone.run(() => {
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

  validarToken(): Observable<boolean> {
    // const token = localStorage.getItem('token') || '';

    return this.http.get(`${base_url}/login/renew`, {
      headers: {
        'x-token': this.token
      }
    }).pipe(
      map((resp: any) => {
        const { email, google, nombre, role, img = '', uid } = resp.usuario;
        this.usuario = new Usuario(nombre, email, '', img, google, role, uid);

        this.guardarLocalStorage( resp.token, resp.menu );

        return true;
      }),
      catchError(error => of(false))
    );

  }

  creandoUsuario(formData: RegisterForm) {

    // peticion http tipo post
    return this.http.post(`${base_url}/usuarios`, formData)
      .pipe(
        tap((resp: any) => {

        this.guardarLocalStorage( resp.token, resp.menu );

        })
      )

  }

  actualizarPerfil(data: { email: string, nombre: string, role: string }) {

    data = {
      ...data,
      role: this.usuario?.role ?? ''
    }

    return this.http.put(`${base_url}/usuarios/${this.uid}`, data, {
      headers: {
        'x-token': this.token
      }
    });


  }

  login(formData: LoginForm) {

    // peticion http tipo post
    return this.http.post(`${base_url}/login`, formData)
      .pipe(
        tap((resp: any) => {

        this.guardarLocalStorage( resp.token, resp.menu );

        })
      )

  }

  loginGoogle(token: string) {
    return this.http.post(`${base_url}/login/google`, { token })
      .pipe(
        tap((resp: any) => {
          console.log(resp)

        this.guardarLocalStorage( resp.token, resp.menu );

        })
      )
  }

  cargarUsuarios(desde: number = 0) {
    // Ruta de la peticion http para cargar usuarios

    const url = `${base_url}/usuarios?desde=${desde}`;
    return this.http.get<CargarUsuario>(url, this.headers)
      .pipe(
        map(resp => {
          const usuarios = resp.usuarios.map(
            user => new Usuario(user.nombre, user.email, '', user.img, user.google, user.role, user.uid)
          );
          return {
            total: resp.total,
            usuarios
          };
        })
      )
  }

  eliminarUsuario(usuario: Usuario) {
    // Ruta de la peticion http para eliminar usuarios
    const url = `${base_url}/usuarios/${usuario.uid}`;
    return this.http.delete(url, this.headers);


  }

  guardarUsuario(usuario: Usuario) {

    return this.http.put(`${base_url}/usuarios/${usuario.uid}`, usuario, {
      headers: {
        'x-token': this.token
      }
    });

  }
}
