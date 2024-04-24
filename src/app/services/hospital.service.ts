import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';

import { environment } from '../../environment.ts/environmet';
import { Hospital } from '../models/hospital.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class HospitalService {

  constructor( private http: HttpClient ) { }


  get token(): string {
    return localStorage.getItem('token') || '';
  }


  get headers(){
    return {
      headers: {
      'x-token': this.token
      }
    }
  }

  cargarHospitales(){

    // Ruta de la peticion http para cargar usuarios
    const url = `${ base_url }/hospitales`;
    return this.http.get<{ ok: boolean, hospitales: Hospital[] }>(url, this.headers)
              .pipe(
                map((resp) => resp.hospitales)
              );
  }

  crearHospital( nombre: string ){

    // Ruta de la peticion http para cargar usuarios
    const url = `${ base_url }/hospitales`;
    // Crea el hospital con el nombre que se asigne
    return this.http.post(url, { nombre }, this.headers);
  }

  actualizarHospital( _id: string, nombre: string ){
    // Ruta de la peticion http para cargar usuarios
    const url = `${ base_url }/hospitales/${ _id }`;
    // Actualiza el hospital con el nombre que se asigne
    return this.http.put(url, { nombre }, this.headers);
  }

  borrarHospital( _id: string ){
    // Ruta de la peticion http para cargar usuarios
    const url = `${ base_url }/hospitales/${ _id }`;
    // Borra el hospital con el el id
    return this.http.delete(url, this.headers);
  }

}
