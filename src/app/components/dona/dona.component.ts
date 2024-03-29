import { Component, Input, OnInit } from '@angular/core';
import Chart, { ChartType } from 'chart.js/auto';


@Component({
  selector: 'app-dona',
  templateUrl: './dona.component.html',
  styles: ``
})
export class DonaComponent implements OnInit {

  @Input() title: string = 'Sin titutlo';

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

    this.chart = new Chart("chart", { // Use a random ID for each chart
      type: 'pie' as ChartType,
      data
    })

  }


}
