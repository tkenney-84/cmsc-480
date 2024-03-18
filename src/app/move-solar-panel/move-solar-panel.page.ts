import { Component, OnInit } from '@angular/core';
import axios from 'axios';
@Component({
  selector: 'app-move-solar-panel',
  templateUrl: './move-solar-panel.page.html',
  styleUrls: ['./move-solar-panel.page.scss'],
})
export class MoveSolarPanelPage implements OnInit {
 

  constructor() { }
  startStopClockwise(){
   
    axios.post('api/solarPanelControl/startStopAzimuth',{
      direction:"Right",
    });
    
  }
  startStopUp(){
    axios.post('api/solarPanelControl/startStopElevation',{
      direction:"Up",
      });
    
  


  }
  startStopCounterClockwise(){
    axios.post('api/solarPanelControl/startStopAzimuth',{
      direction:"Left",
     });
    
    
  }
  startStopDown(){
    axios.post('api/solarPanelControl/startStopElevation',{
      direction:"Down",
    });
    
  }
 
  getSolarPosition(){
    axios.get(`api/getPanelPosition`).then((response) =>{
      console.log(response);
  }).catch((err) =>{
    console.log(err);
  });
  }

  ngOnInit() {
  }

}
