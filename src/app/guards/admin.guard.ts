import { Injectable } from '@angular/core';

import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { UsuarioService } from '../services/usuario.service';
// import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})


export class AdminGuard implements CanActivate {

  constructor( private usuarioService: UsuarioService,
               private router: Router ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    // state: RouterStateSnapshot ): boolean | Observable<boolean> | Promise<boolean> {


    // Guard para no dejar observar algunos items del menu si no es usuario ADMIN_ROLE

    // Verificar el role del usuario
    if (this.usuarioService.role === 'ADMIN_ROLE') {
      return true;
    } else {
      this.router.navigateByUrl( '/dashboard' );
      return false;
    }

  }

}
