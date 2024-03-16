import { Component, OnInit } from '@angular/core';
// import { PlatformLocation } from '@angular/common';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styles: ``
})
export class PagesComponent implements OnInit {

  public linkTheme = document.querySelector( '#theme' );

  constructor() { }

  ngOnInit(): void {

    const url = localStorage.getItem( 'theme' ) || './assets/css/colors/blue.css';
    this.linkTheme?.setAttribute( 'href', url );

  }

}



