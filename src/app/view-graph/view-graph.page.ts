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
    this.showChartOne();
    this.showChartTwo();
    this.showChartThree();
    this.showChartFour();
  }
  showChartOne() {
    var ctx = document.getElementById('solarPanelOneBar') as HTMLCanvasElement;
    var chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels:['6am','7am','8am','9am','10am','11am','12pm','1pm','2pm','3pm','4pm','5pm','6pm','7pm','8pm','9pm'],
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
          data:[70,15,50,90,35,80,25,65,40,5,85,20,75,55,10,95],
          borderWidth: 1
        }]
      }
    });
  }

  showChartTwo(){
    var ctx2 = document.getElementById('solarPanelOneLine') as HTMLCanvasElement;
    var chart2 = new Chart(ctx2, {
      type: 'line',
      data: {
        labels:['6am','7am','8am','9am','10am','11am','12pm','1pm','2pm','3pm','4pm','5pm','6pm','7pm','8pm','9pm'],
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
          data:[70,15,50,90,35,80,25,65,40,5,85,20,75,55,10,95],
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

  showChartThree(){
    var ctx3 = document.getElementById('solarPanelTwoBar') as HTMLCanvasElement;
    var chart3 = new Chart(ctx3, {
      type: 'bar',
      data: {
        labels:['6am','7am','8am','9am','10am','11am','12pm','1pm','2pm','3pm','4pm','5pm','6pm','7pm','8pm','9pm'],
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
          data:[20,80,30,45,20,45,90,20,40,10,5,20,45,60,40,55],
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

  showChartFour(){
    var ctx4 = document.getElementById('SolarPanelTwoLine') as HTMLCanvasElement;
    var chart4 = new Chart(ctx4, {
      type: 'line',
      data: {
        labels:['6am','7am','8am','9am','10am','11am','12pm','1pm','2pm','3pm','4pm','5pm','6pm','7pm','8pm','9pm'],
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
          data:[20,80,30,45,20,45,90,20,40,10,5,20,45,60,40,55],
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
}
