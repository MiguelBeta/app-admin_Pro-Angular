import { error } from 'node:console';
import { Component, OnInit, input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

import { UsuarioService } from '../../services/usuario.service';
import { FileUploadService } from '../../services/file-upload.service';

import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styles: ``
})
export class PerfilComponent implements OnInit {

  public perfilForm!: FormGroup;
  public usuario?: Usuario;
  public imagenSubir?: File;
  public imgTemp: any = null;

  constructor(private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private fileuploadservice: FileUploadService) {

    this.usuario = usuarioService.usuario;
  }


  ngOnInit(): void {

    this.perfilForm = this.fb.group({
      nombre: [this.usuario?.nombre || '', Validators.required],
      email: [this.usuario?.email || '', [Validators.required, Validators.email]],
    });

  }

  actualizarPerfil() {
    console.log(this.perfilForm?.value);

    if (this.usuario) {
      this.usuarioService.actualizarPerfil(this.perfilForm.value)
        .subscribe( () => {
          const { nombre, email } = this.perfilForm.value;
          if (this.usuario) {
            this.usuario.nombre = nombre;
            this.usuario.email = email;

            Swal.fire('Guardado', 'Los cambios fueron guardados', 'success');
          }
        },
          ( error: any ) => {
            Swal.fire('Error', error.error.msg, 'error');
          }
        );
    }
  }

  cambiarImagen(event: Event) {
    const inputFile = event.target as HTMLInputElement;
    const files = inputFile.files;
    if (files && files.length > 0) {
      const file = files[0];
      console.log(file);
      this.imagenSubir = file;

      // Sino existe img temporal se cancela
      // if ( !file ){
      //   return this.imgTemp = null;
      // }

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

    if (this.imagenSubir && this.usuario?.uid) {
      this.fileuploadservice
        .actualizarFoto(this.imagenSubir, 'usuarios', this.usuario?.uid)
        .then(img => {
          if (this.usuario) {
            this.usuario.img = img
            Swal.fire('Actualizado', 'La imagen fue actualizada', 'success');

            }
          }
        );

    } else {
      console.log('No se ha seleccionado ninguna imagen.');
      Swal.fire('Error', 'no se ha seleccionado ninguna imagen', 'error');

    }
  }

}

