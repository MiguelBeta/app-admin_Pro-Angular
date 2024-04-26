import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';

import { Hospital } from '../../../models/hospital.model';
import { Medico } from '../../../models/medico.model';

import { HospitalService } from '../../../services/hospital.service';
import { MedicoService } from '../../../services/medico.service';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: ``
})
export class MedicoComponent implements OnInit{

  public medicoForm!: FormGroup;
  public hospitales: Hospital[] = [];
  public hospitalSeleccionado?: Hospital;
  public medicolSeleccionado?: Medico;


  // public hospitalSeleccionado: Hospital | null = null;

  constructor ( private fb: FormBuilder,
                private hospitalService: HospitalService,
                private medicoService: MedicoService,
                private router: Router,
                private activatedRouter: ActivatedRoute ){ }


  ngOnInit(): void {

    this.activatedRouter.params
      .subscribe( ({ id }) => {
        this.cargarMedico( id );
    })


    this.medicoForm = this.fb.group({
      //Se asignan las variables como las recibe el BackEnd
      nombre:   [ '', Validators.required ],
      hospital: [ '', Validators.required ],
    });

    this.cargarHospitales();

    //Obtener el id o instancia del hospital seleccionado
    this.medicoForm.get('hospital')?.valueChanges
      .subscribe( hospitalId => {

        this.hospitalSeleccionado = this.hospitales.find( h => h._id === hospitalId );
        // this.hospitalSeleccionado = this.hospitales.find( h => h._id === hospitalId ) || null;


      })
  }

  cargarHospitales(){

    this.hospitalService.cargarHospitales()
      .subscribe( ( hospitales: Hospital[] ) => {
        this.hospitales = hospitales;
      });
  }

  cargarMedico( id: string ){

    this.medicoService.obtenerMedicoPorId( id )
      .subscribe( medico => {
        console.log(medico);
        this.medicolSeleccionado = medico;
      })

  }

  guardarMedico(){
    const { nombre } = ( this.medicoForm.value );
    this.medicoService.crearMedico( this.medicoForm.value )
      .subscribe (( resp: any ) => {
        console.log(resp);
        Swal.fire( 'Creado', `${ nombre } creado exitosamente`, 'success' );
        this.router.navigateByUrl(`/dashboard/medico/${ resp.medico._id }`);
      })
  }

}
