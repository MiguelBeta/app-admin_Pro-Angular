import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

import { HospitalService } from '../../../services/hospital.service';
import { Hospital } from '../../../models/hospital.model';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: ``
})
export class HospitalesComponent implements OnInit{

  public hospitales: Hospital[] = [];
  public cargando: boolean = true;
  public imgSubs: Subscription;


  constructor( private hospitalService: HospitalService,
               private modalImagenService: ModalImagenService ){

                this.imgSubs = new Subscription();
              }


  ngOnInit(): void {
    this.cargarHospitales();

    this.imgSubs = this.imgSubs = this.modalImagenService.nuevaImagen
    .subscribe( img => this.cargarHospitales() );
  }

  cargarHospitales(){
    this.cargando = true;
    this.hospitalService.cargarHospitales()
      .subscribe( hospitales => {
      this.cargando = false;
      this.hospitales = hospitales;
      })
  }

  guardarCambios( hospital: Hospital ){

    this.hospitalService.actualizarHospital( hospital._id, hospital.nombre )
      .subscribe( resp => {
        Swal.fire( 'Actualizado', hospital.nombre, 'success' );
      });
  }

  eliminarHospital( hospital: Hospital ){

    this.hospitalService.borrarHospital( hospital._id )
      .subscribe( resp => {
        this.cargarHospitales();
        Swal.fire( 'Borrado', hospital.nombre, 'success' );
      });
  }

  async abrirSweetAlert(){
    const result = await Swal.fire<string>({
      title: 'Crear Hospital',
      text: "Ingrese el nombre del nuevo Hospital",
      input: "text",
      inputPlaceholder: "Nombre del hospital",
      showCancelButton: true
    });
    if( result && result.value && result.value.trim().length > 0 ){
      this.hospitalService.crearHospital(result.value )
        .subscribe( (resp: any) => {
          this.hospitales.push( resp.hospital );
          Swal.fire( 'Creado exitosamente', result.value, 'success' );

        });
    }
      // Swal.fire(`Entered URL: ${url}`);

  }

  abrirModal( hospital: Hospital ){
      // console.log(usuario);
      if (hospital.img && hospital._id) {
        this.modalImagenService.abrirModal('hospitales', hospital._id, hospital.img );
      } else {
        console.error('La URL de la imagen es undefined');
      }
  }

}
