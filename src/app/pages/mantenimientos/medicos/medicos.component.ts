import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

import { Medico } from '../../../models/medico.model';

import { MedicoService } from '../../../services/medico.service';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { BusquedasService } from '../../../services/busquedas.service';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: ``
})
export class MedicosComponent implements OnInit, OnDestroy {

  public cargando: boolean = true;
  public medicos: Medico[] = [];
  public imgSubs!: Subscription;



  constructor( private medicoService: MedicoService,
               private modalImagenService: ModalImagenService,
               private busquedasService: BusquedasService ) {

              // this.imgSubs = new Subscription();

              }


  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarMedicos();

    this.imgSubs = this.imgSubs = this.modalImagenService.nuevaImagen
    .subscribe( img => this.cargarMedicos() );
  }

  cargarMedicos() {
    this.cargando = true;
    this.medicoService.cargarMedico()
      .subscribe(medicos => {
        this.cargando = false;
        this.medicos = medicos;
        console.log(medicos);
      });
  }

  buscar( termino: string ){

    if( termino.length === 0 ){
      return this.cargarMedicos();
    }

    this.busquedasService.buscar( 'medicos', termino )
        .subscribe( resp => {
          this.medicos = resp.filter( item => item instanceof Medico ) as Medico[];
          // this.hospitales = resp.filter( item => item ) as Hospital[];
        });
    return;

  }

  abrirModal(medico: Medico) {
    // console.log(usuario);
    if (medico.img && medico._id) {
      this.modalImagenService.abrirModal( 'medicos', medico._id, medico.img );
    } else {
      console.error('La URL de la imagen es undefined');
    }
  }

  borrarMedico( medico: Medico ){

    Swal.fire({
      title: "¿Borrar medico?",
      text: `Esta apunto de borrar a ${ medico.nombre }`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Si, eliminar medico"
    }).then((result) => {
      if (result.isConfirmed) {

        this.medicoService.borrarMedico( medico._id )
          .subscribe( resp => {

            this.cargarMedicos();
            Swal.fire(
                'Usuario borrado',
                `${ medico.nombre } fue eliminado correctamente`,
                 "success"
              );
          })
      }
    });

    return;
  }

}
