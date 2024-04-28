import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario.model';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: []
})
export class HeaderComponent implements OnInit  {

  // public imgUrl = '';
  public usuario?: Usuario;
  public mostrarInputBusqueda: boolean = false;

  constructor( private usuarioServices: UsuarioService,
               private router: Router ) {
    this.usuario = usuarioServices.usuario;
  }

  toggleInputBusqueda() {
    this.mostrarInputBusqueda = !this.mostrarInputBusqueda;
  }

  ngOnInit(): void {
  }

  logout(){
    this.usuarioServices.logout();
  }

  buscar( termino: string ){

    if( termino.length === 0 ){
      Swal.fire( '¡Termino Incorrecto!', `Realice una busqueda valida`, 'question' );
      // return;
    }

    // Se pone la ruta a la cual debe navegar y se concatena
    // el termino de busqueda ingresado en el input del search
    this.router.navigateByUrl(`/dashboard/buscar/${ termino }`);
    this.mostrarInputBusqueda = false;

  }


}
