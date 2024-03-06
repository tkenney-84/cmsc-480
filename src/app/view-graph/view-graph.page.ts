import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js/auto'; // Importing Chart from 'chart.js/auto'

@Component({
  selector: 'app-view-graph',
  templateUrl: 'view-graph.page.html',
  styleUrls: ['view-graph.page.scss'],
})
export class ViewGraphPage implements OnInit {
  
  constructor() { }

  ngOnInit() {
    this.showChart();
  }

  showChart() {
    var ctx = document.getElementById('chartPower') as HTMLCanvasElement;
    var chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels:['AV','VA'],
        datasets: [{
          label: "Power",
          backgroundColor: [
            'rgba(255,99,132,0.2)', // Corrected color values
            'rgba(233,93,123,0.2)'
          ],
          borderColor: [
            'rgba(255,99,132,1)',
            'rgba(255,99,132,1)'
          ],
          data:[20,80],
          borderWidth: 1
        }]
      }
    });
  }
}
