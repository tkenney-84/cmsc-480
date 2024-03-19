import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js/auto'; 

@Component({
  selector: 'app-view-graph',
  templateUrl: 'view-graph.page.html',
  styleUrls: ['view-graph.page.scss'],
})
export class ViewGraphPage implements OnInit {
  
  constructor() { }

  ngOnInit() {
<<<<<<< Updated upstream
    //this.showChart();
  }

  // showChart() {
  //   var ctx = document.getElementById('chartPower') as HTMLCanvasElement;
  //   var chart = new Chart(ctx, {
  //     type: 'bar',
  //     data: {
  //       labels:['AV','VA'],
  //       datasets: [{
  //         label: "Power",
  //         backgroundColor: [
  //           'rgba(255,99,132,0.2)', // Corrected color values
  //           'rgba(233,93,123,0.2)'
  //         ],
  //         borderColor: [
  //           'rgba(255,99,132,1)',
  //           'rgba(255,99,132,1)'
  //         ],
  //         data:[20,80],
  //         borderWidth: 1
  //       }]
  //     }
   // });
  //}
=======
    this.showChart();
    this.showChart2();
  }

  showChart2(){
    var ctx2 = document.getElementById('chartEnergy') as HTMLCanvasElement;
    var chart2 = new Chart(ctx2, {
      type: 'line',
      data: {
        labels:['AA','BB'],
        datasets: [{
          label: "Engery",
          backgroundColor: [
            'rgba(255,99,132,0.2)', 
            'rgba(233,93,123,0.2)'
          ],
          borderColor: [
            'rgba(255,99,132,1)',
            'rgba(255,99,132,1)'
          ],
          data:[20,80],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          x: {
            axis:'x'
          },
          y: {
            axis:'y'
          }
        }
      }
    });
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
            'rgba(255,99,132,0.2)', 
            'rgba(233,93,123,0.2)'
          ],
          borderColor: [
            'rgba(255,99,132,1)',
            'rgba(255,99,132,1)'
          ],
          data:[20,100],
          borderWidth: 1
        }]
      }
    });
  }
>>>>>>> Stashed changes
}
