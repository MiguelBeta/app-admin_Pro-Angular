import { Component, OnInit } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: ``
})
export class SidebarComponent implements OnInit {

  // public menuItems: any[];
  public usuario?: Usuario;


  constructor( public sidebarService: SidebarService,
               private usuarioService: UsuarioService,
               private router: Router ) {


    // this.menuItems = sidebarService.menu;
    this.usuario = usuarioService.usuario;
  }
  ngOnInit(): void {
    // Llama al método cargarMenu() al iniciar el componente
    this.sidebarService.cargarMenu();
    // Obtiene el usuario actual
    this.usuario = this.usuarioService.usuario;

  }


}
