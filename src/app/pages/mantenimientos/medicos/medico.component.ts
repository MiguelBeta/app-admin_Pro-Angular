import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { HospitalService } from '../../../services/hospital.service';
import { Hospital } from '../../../models/hospital.model';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: ``
})
export class MedicoComponent implements OnInit{

  public medicoForm!: FormGroup;
  public hospitales: Hospital[] = [];
  public hospitalSeleccionado?: Hospital;
  // public hospitalSeleccionado: Hospital | null = null;

  constructor ( private fb: FormBuilder,
                private hospitalService: HospitalService ){ }


  ngOnInit(): void {

    this.medicoForm = this.fb.group({
      //Se asignan las variables como las recibe el BackEnd
      nombre:   [ 'Eduardo', Validators.required ],
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

  guardarMedico(){
    // console.log( this.medicoForm.value );
  }

}
