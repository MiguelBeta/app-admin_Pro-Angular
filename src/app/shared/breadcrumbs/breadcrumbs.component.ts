import { Component, OnDestroy } from '@angular/core';
import { ActivationEnd, Router, NavigationStart, Route, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styles: ``
})
export class BreadcrumbsComponent implements OnDestroy {

  public titulo!: string;
  public tituloSubs$: Subscription;

  constructor( private router: Router, private route: ActivatedRoute ) {

    this.tituloSubs$ = this.getArgumentosRuta()
                        .subscribe( (titulo: string ) => {
                          this.titulo = titulo;
                          document.title = `AdminPro - ${ titulo }`;
                        });
  }
  ngOnDestroy(): void {
    this.tituloSubs$.unsubscribe();
  }

    getArgumentosRuta(){

      return this.router.events
        .pipe(
          filter( (event): event is ActivationEnd => event instanceof ActivationEnd),
          filter( (event: ActivationEnd) => event.snapshot.firstChild === null ),
          map((event: ActivationEnd) => event.snapshot.data['titulo']),
        );
    }

}


// filter( (event: ActivationEnd) => event.snapshot.firstChild === null ),
//         map( (event: ActivationEnd) => event.snapshot.data ),
