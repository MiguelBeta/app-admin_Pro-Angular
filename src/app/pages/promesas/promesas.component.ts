import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-promesas',
  templateUrl: './promesas.component.html',
  styles: ``
})
export class PromesasComponent implements OnInit {

  constructor() { }


  ngOnInit(): void {

  this.getUsuarios();

  }

  getUsuarios() {

    fetch('https://reqres.in/api/users')
      .then( resp => console.log( resp ));
  }



}
