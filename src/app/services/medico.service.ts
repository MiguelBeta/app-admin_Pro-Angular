import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';

import { environment } from '../../environment.ts/environmet';
import { Medico } from '../models/medico.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

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

  cargarMedicos(){

    // Ruta de la peticion http para cargar usuarios
    const url = `${ base_url }/medicos`;
    return this.http.get<{ ok: boolean, medicos: Medico[] }>(url, this.headers)
              .pipe(
                map( (resp) => resp.medicos)
              );
  }

  crearMedicos( medicos: Medico ){

    // Ruta de la peticion http para cargar usuarios
    const url = `${ base_url }/medicos`;
    // Crea el hospital con el nombre que se asigne
    return this.http.post(url, medicos, this.headers);
  }

  actualizarMedicos( medico: Medico ){
    // Ruta de la peticion http para cargar usuarios
    const url = `${ base_url }/medicos/${ medico._id }`;
    // Actualiza el hospital con el nombre que se asigne
    return this.http.put(url, medico, this.headers);
  }

  borrarMedicos( _id: string ){
    // Ruta de la peticion http para cargar usuarios
    const url = `${ base_url }/medicos/${ _id }`;
    // Borra el hospital con el el id
    return this.http.delete(url, this.headers );
  }
}
