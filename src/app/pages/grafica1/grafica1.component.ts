import { Component, OnInit } from '@angular/core';
import Chart, { ChartType } from 'chart.js/auto';


@Component({
  selector: 'app-grafica1',
  templateUrl: './grafica1.component.html',
  styles: ``
})
export class Grafica1Component implements OnInit {

  public chart: Chart | undefined;
  public hola: string[] = ['Download Sales', 'In-Store Sales', 'Mail-Order Sales'];

  ngOnInit(): void {
    this.generateChart();
  }

  generateChart(): void {
    const data = {


      labels: this.hola,

      datasets: [{
        hola: ['Download Sales', 'In-Store Sales', 'Mail-Order Sales',] as any[],
        data: [350, 450, 100],
        backgroundColor: [
            '#6857E6',
            '#009EEE',
            '#F02059'
        ],

        hoverOffset: 4
      }]
    };

    this.chart = new Chart("chart", {
      type: 'pie' as ChartType,
      data
    })

  }


}


