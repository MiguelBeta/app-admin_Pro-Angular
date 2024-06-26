import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  public menu: any[] = [];

  cargarMenu(){
    const storedMenu =  localStorage.getItem('menu');
    this.menu = storedMenu ? JSON.parse(storedMenu) : [];
  }

  // menu: any[] = [
  //   {
  //     titulo: 'Dashboard',
  //     icono: 'mdi mdi-gauge',
  //     submenu: [
  //       { titulo: 'Main', url: '/' },
  //       { titulo: 'ProgressBar', url: 'progress' },
  //       { titulo: 'Graficas',    url: 'grafica1' },
  //       { titulo: 'Promesas',    url: 'promesas' },
  //       { titulo: 'Rxjs',        url: 'rxjs' },

  //     ]
  //   },

  //   {
  //     titulo: 'Mantenimientos',
  //     icono: 'mdi mdi-folder-lock-open',
  //     submenu: [
  //       { titulo: 'Usuarios', url: 'usuarios' },
  //       { titulo: 'Hospitales', url: 'hospitales' },
  //       { titulo: 'Medicos',    url: 'medicos' },
  //     ]
  //   }

  // ];

}
