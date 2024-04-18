import { Component } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: []
})
export class HeaderComponent  {

  public imgUrl = '';
  public usuario?: Usuario;

  constructor( private usuarioServices: UsuarioService ) {
    // this.imgUrl = usuarioServices.usuario?.imagenUrl;
    this.usuario = usuarioServices.usuario;
  }

  logout(){
    this.usuarioServices.logout();
  }


}
