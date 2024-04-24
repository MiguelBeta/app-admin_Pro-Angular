import { Component, OnInit } from '@angular/core';

import { Medico } from '../../../models/medico.model';

import { MedicoService } from '../../../services/medico.service';
import { ModalImagenService } from '../../../services/modal-imagen.service';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: ``
})
export class MedicosComponent implements OnInit {

  public cargando: boolean = true;
  public medicos: Medico[] = [];

  constructor( private medicoService: MedicoService,
               private modalImagenService: ModalImagenService ) { }

  ngOnInit(): void {
    this.cargarMedico();
  }

  cargarMedico() {
    this.cargando = true;
    this.medicoService.cargarMedicos()
      .subscribe(medicos => {
        this.cargando = false;
        this.medicos = medicos;
        console.log(medicos);
      });
  }

  abrirModal(medico: Medico) {
    // console.log(usuario);
    if (medico.img && medico._id) {
      this.modalImagenService.abrirModal( 'medicos', medico._id, medico.img );
    } else {
      console.error('La URL de la imagen es undefined');
    }
  }

}
