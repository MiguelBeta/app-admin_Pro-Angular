import { Injectable } from '@angular/core';
import { environment } from '../../environment.ts/environmet';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  constructor() { }

  async actualizarFoto(

    archivo: File,
    tipo: 'usuarios' | 'medicos' | 'hospitales',
    id: string
  ){

    try {

      // Accedemos a la ruta donde se va hacer la carga
      const url = `${ base_url }/upload/${ tipo }/${ id }`;

      // Accedemos directame a la carga de datos
      const formData = new FormData();
      formData.append('imagen', archivo);

      // Hacemos la peticion http mediante el fetch
      const resp = await fetch( url, {
        method: 'PUT',
        headers: {
          'x-token': localStorage.getItem('token') || ''
        },
        body: formData
      });

      const data = await resp.json();
      if ( data.ok ){
        return data.nombreArchivo;
      } else {
        console.log(data.msg);
        return false;
      }

    } catch (error) {
      console.log(error);
      return false;   // Devolvemos false si hubo un error durante la carga
    }

  }

}
