import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';

import { Hospital } from '../../../models/hospital.model';
import { Medico } from '../../../models/medico.model';

import { HospitalService } from '../../../services/hospital.service';
import { MedicoService } from '../../../services/medico.service';
import { delay } from 'rxjs';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: ``
})
export class MedicoComponent implements OnInit{

  public medicoForm!: FormGroup;
  public hospitales: Hospital[] = [];
  public hospitalSeleccionado?: Hospital;
  public medicoSeleccionado?: Medico;


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

    if ( id === 'nuevo' ){
      return;
    }

    this.medicoService.obtenerMedicoPorId( id )
    // .pipe(
    //   delay(100)
    //  )
      .subscribe( medico => {


        if ( !medico  ){
          this.router.navigateByUrl(`/dashboard/medicos`);
          return;
        }
        // Verifica si el objeto medico.hospital no es nulo o indefinido antes de acceder a su propiedad _id
        const { nombre, hospital } = medico;
        const hospitalId = hospital?._id;

        // Extrae el medico y nombre del hospital del formulario
        if( hospitalId ){
          this.hospitalSeleccionado = this.hospitales.find( h => h._id === hospitalId );

          // Asigna el valor del formulario con la clave 'hospital' y el valor hospitalId
          this.medicoForm.setValue({ nombre, hospital: hospitalId });
        }
        // medico seleccionado por Id
        this.medicoSeleccionado = medico;

      })

  }

  guardarMedico(){

    const { nombre } = ( this.medicoForm.value );

    if ( this.medicoSeleccionado ){
      // Actualiza el valor del medico
      const data = {
        ...this.medicoForm.value,
        _id: this.medicoSeleccionado._id
      }
      this.medicoService.actualizarMedico( data )
        .subscribe( resp => {
          Swal.fire( 'Actualizado', `${ nombre } actualizado exitosamente`, 'success' );
        });

    } else {
      // Crea el medico

      this.medicoService.crearMedico( this.medicoForm.value )
        .subscribe (( resp: any ) => {
          Swal.fire( 'Creado', `${ nombre } creado exitosamente`, 'success' );
          this.router.navigateByUrl(`/dashboard/medico/${ resp.medico._id }`);
        })

    }


  }

}
