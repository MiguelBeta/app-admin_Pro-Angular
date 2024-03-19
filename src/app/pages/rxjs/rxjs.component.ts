import { Component, OnDestroy } from '@angular/core';
import { Observable, Subscription, interval, observable,  } from 'rxjs';
import { filter, map, retry, take } from 'rxjs/operators';


@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: ``
})
export class RxjsComponent implements OnDestroy {

  public intervalSubs: Subscription;

  constructor(){

    //Hasta que no se suscriba no inicia el observable a trabajar
    // this.retornaObsevable().pipe(
    //     // Reintenta correr el observable 2 veces
    //     retry(2)
    //   ).subscribe(
    //     valor => console.log( 'Subs:', valor ),
    //     // Error del obs
    //     error => console.warn( 'Error', error ),
    //     // Termina el obsrvable
    //     () => console.log( 'Obs terminado' )
    //   );

    this.intervalSubs = this.retornaIntervalo().subscribe( console.log )

  }
  ngOnDestroy(): void {
    this.intervalSubs.unsubscribe();
  }

  retornaIntervalo(): Observable<number> {

    return interval(500)
            .pipe(
              map( valor => valor + 1 ),
              filter( valor => ( valor % 2 === 0 ) ? true: false ),
              //take(10),
            );
  }

  retornaObsevable(): Observable<number>{
    let i = -1;

    //Se acostumbra a nombrar los obsrvables acompañados de $
    return new Observable<number> ( observer => {


      const intervalo = setInterval( () => {

        i++;
        observer.next( i );

        if( i === 4 ) {
          clearInterval( intervalo );
          observer.complete();
        }

        if( i === 2 ) {
          observer.error( 'i llego al valor de 2' );
        }

      }, 1000 )

    });

  }

}
