import { Component } from '@angular/core';

import { ModalImagenService } from '../../services/modal-imagen.service';
import { FileUploadService } from '../../services/file-upload.service';

import Swal from 'sweetalert2';
import { Usuario } from '../../models/usuario.model';


@Component({
  selector: 'app-modal-imagen',
  templateUrl: './modal-imagen.component.html',
  styles: ``
})
export class ModalImagenComponent {

  public imagenSubir?: File;
  public usuario?: Usuario;
  public imgTemp: any = null;


  constructor( public modalImagenService: ModalImagenService,
               public fileUploadService: FileUploadService ){ }

  cerrarModal(){
    this.imgTemp = null;
    this.modalImagenService.cerrarModal();
  }

  cambiarImagen(event: Event) {
    const inputFile = event.target as HTMLInputElement;
    const files = inputFile.files;
    if (files && files.length > 0) {
      const file = files[0];
      console.log(file);
      this.imagenSubir = file;

      // Cargamos la nueva imagen que
      const reader = new FileReader();

      // Se muestra antes de subirla
      reader.onload = () => {
        this.imgTemp = reader.result;
      };
      reader.readAsDataURL(file); // Inicia la lectura del archivo

    } else {
      this.imagenSubir = undefined;
      this.imgTemp = null;  // Asignar null a imgTemp si no se selecciona ningún archivo
    }

  }

  subirImagen() {

    const id = this.modalImagenService.id;
    const tipo = this.modalImagenService.tipo;

    if (this.imagenSubir && this.usuario?.uid) {
      this.fileUploadService
        .actualizarFoto( this.imagenSubir, tipo, id)
        .then(img => {
            Swal.fire('Actualizado', 'La imagen fue actualizada', 'success');
            this.cerrarModal();
        })
        .catch(err => {
          console.log(err);
          Swal.fire('Error', 'No se pudo subir la imagen', 'error');

          this.modalImagenService.nuevaImagen.emit('Imagen actualizada');
        })
    } else {
      Swal.fire('Error', 'No se pudo subir la imagen', 'error');
      console.log('No se ha seleccionado ninguna imagen.');
    }
  }


}
