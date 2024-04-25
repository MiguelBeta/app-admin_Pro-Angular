import { Component, OnDestroy, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';

import { Hospital } from '../../../models/hospital.model';

import { HospitalService } from '../../../services/hospital.service';
import { BusquedasService } from '../../../services/busquedas.service';
import { ModalImagenService } from '../../../services/modal-imagen.service';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: ``
})
export class HospitalesComponent implements OnInit, OnDestroy {

  public hospitales: Hospital[] = [];
  public cargando: boolean = true;
  public imgSubs!: Subscription;


  constructor(private hospitalService: HospitalService,
    private modalImagenService: ModalImagenService,
    private busquedasService: BusquedasService) {

    // this.imgSubs = new Subscription();
  }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarHospitales();

    this.imgSubs = this.imgSubs = this.modalImagenService.nuevaImagen
      .subscribe(img => this.cargarHospitales());
  }

  buscar(termino: string) {

    if (termino.length === 0) {
      return this.cargarHospitales();
    }

    this.busquedasService.buscar('hospitales', termino)
      .subscribe(resp => {
        // this.hospitales = resp;
        this.hospitales = resp.filter(item => item instanceof Hospital) as Hospital[];
        // this.hospitales = resp.filter( item => item ) as Hospital[];
      });
  }

  cargarHospitales() {
    this.cargando = true;
    this.hospitalService.cargarHospitales()
      .subscribe(hospitales => {
        this.cargando = false;
        this.hospitales = hospitales;
      })
  }

  guardarCambios(hospital: Hospital) {

    this.hospitalService.actualizarHospital(hospital._id, hospital.nombre)
      .subscribe(resp => {
        Swal.fire('Actualizado', hospital.nombre, 'success');
      });
  }

  eliminarHospital(hospital: Hospital) {

    this.hospitalService.borrarHospital(hospital._id)
      .subscribe(resp => {
        this.cargarHospitales();
        Swal.fire('Borrado', hospital.nombre, 'success');
      });
  }

  async abrirSweetAlert() {
    const result = await Swal.fire<string>({
      title: 'Crear Hospital',
      text: "Ingrese el nombre del nuevo Hospital",
      input: "text",
      inputPlaceholder: "Nombre del hospital",
      showCancelButton: true
    });
    if (result && result.value && result.value.trim().length > 0) {
      this.hospitalService.crearHospital(result.value)
        .subscribe((resp: any) => {
          this.hospitales.push(resp.hospital);
          Swal.fire('Creado exitosamente', result.value, 'success');

        });
    }

  }

  abrirModal(hospital: Hospital) {
    // console.log(usuario);
    if (hospital.img && hospital._id) {
      this.modalImagenService.abrirModal('hospitales', hospital._id, hospital.img);
    } else {
      console.error('La URL de la imagen es undefined');
    }
  }

}
