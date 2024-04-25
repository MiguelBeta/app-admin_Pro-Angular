import { Component, OnDestroy, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';

import { Usuario } from '../../../models/usuario.model';

import { UsuarioService } from '../../../services/usuario.service';
import { BusquedasService } from '../../../services/busquedas.service';
import { ModalImagenService } from '../../../services/modal-imagen.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: ``
})
export class UsuariosComponent implements OnInit, OnDestroy{

  public totalUsuarios: number = 0;
  public usuarios: Usuario[] = [];
  public usuariosTemp: Usuario[] = [];

  public imgSubs!: Subscription;
  public desde: number = 0;
  public cargando: boolean = true;


  constructor( private usuarioService: UsuarioService,
               private busquedasService: BusquedasService,
               private modalImagenService: ModalImagenService ){


                // this.imgSubs = new Subscription();
              }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarUsuarios();

    this.imgSubs = this.modalImagenService.nuevaImagen
      .subscribe( img => this.cargarUsuarios() );
  }

  cargarUsuarios(){
    this.cargando = true;
    this.usuarioService.cargarUsuarios( this.desde )
      .subscribe( ({ total, usuarios }) => {
        this.totalUsuarios = total;
        this.usuarios = usuarios;
        this.usuariosTemp = usuarios;
        this.cargando = false;

    });
  }

  cambiarPagina( valor: number ){
    const nuevaDesde = this.desde + valor;
    // this.desde += valor;

    // if( this.desde < 0 ){
    //   this.desde = 0;
    // } else if( this.desde >= this.totalUsuarios ){
    //   this.desde -= valor;
    // }

    if ( nuevaDesde >= 0 && nuevaDesde < this.totalUsuarios ){
      this.desde = nuevaDesde;
      this.cargarUsuarios();
    }

    // return;

    // this.cargarUsuarios();
  }

  buscar( termino: string ){

    if( termino.length === 0 ){
      return this.usuarios = this.usuariosTemp;
    }

    this.busquedasService.buscar( 'usuarios', termino )
        .subscribe( resp => {
          this.usuarios = resp.filter( item => item instanceof Usuario ) as Usuario[];

        });
    return;

  }

  eliminarUsuario( usuario:Usuario ){

    if( usuario.uid === this.usuarioService.uid ){
      return Swal.fire( 'Error', 'No puede borrar su propio usuario', 'error' );
    }

    Swal.fire({
      title: "¿Borrar usuario?",
      text: `Esta apunto de borrar a ${ usuario.nombre }`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Si, eliminar usuario"
    }).then((result) => {
      if (result.isConfirmed) {

        this.usuarioService.eliminarUsuario( usuario )
          .subscribe( resp => {

            this.cargarUsuarios();
            Swal.fire(
                'Usuario borrado',
                `${ usuario.nombre } fue eliminado correctamente`,
                 "success"
              );
          })
      }
    });

    return;

  }

  cambiarRole( usuario: Usuario ){

    this.usuarioService.guardarUsuario( usuario )
      .subscribe( resp => {
        console.log( resp );
      })

  }

  abrirModal( usuario: Usuario){
    console.log(usuario);
    if (usuario.imagenUrl && usuario.uid) {
      this.modalImagenService.abrirModal('usuarios', usuario.uid, usuario.imagenUrl);
    } else {
      console.error('La URL de la imagen es undefined');
    }

  }

}
