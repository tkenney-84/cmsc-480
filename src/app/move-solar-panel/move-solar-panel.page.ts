import { Component, OnInit } from '@angular/core';
import axios from 'axios';
@Component({
  selector: 'app-move-solar-panel',
  templateUrl: './move-solar-panel.page.html',
  styleUrls: ['./move-solar-panel.page.scss'],
})
export class MoveSolarPanelPage implements OnInit {
 
  isDisabled:boolean = false;
  constructor() { }

  movePanel(event: MouseEvent){
    this.isDisabled = true;
    var self = this;
    const directionButton = event.target as HTMLButtonElement;
    var buttonVal = directionButton.textContent;
    
    console.log(buttonVal)

    if(buttonVal?.match('Right') !== null || buttonVal?.match('Left') !== null){
    
      axios.post('api/solarPanelControl/startStopAzimuth',{
        direction:buttonVal,
      }).then(()=>{
        console.log("line 26");
         this.isDisabled = false;
         
      }).catch((err)=>{
        
        console.log("Error: "  +err)
      });
    }else{
      
      axios.post('api/solarPanelControl/startStopElevation',{
        direction:buttonVal,
      }).then(()=>{
        console.log("Line 37")
         this.isDisabled = false;
      }).catch((err)=>{
        console.log("Error: "  +err)
      });
    }
    
  }

  // startStopClockwise(){
  //   this.isDisabled = true;
  //   axios.post('api/solarPanelControl/startStopAzimuth',{
  //     direction:"Right",
  //   }).then(()=>{
  //      this.isDisabled = false;
  //   });
   
  // }
  // startStopUp(){
  //   this.isDisabled = true;
  //   axios.post('api/solarPanelControl/startStopElevation',{
  //     direction:"Up",
  //     }).then(()=>{
  //       this.isDisabled = false;
  //     });

  // }
  // startStopCounterClockwise(){
  //   this.isDisabled = true;
  //   axios.post('api/solarPanelControl/startStopAzimuth',{
  //     direction:"Left",
  //    }).then(()=>{
  //     this.isDisabled = false;
  //   });
    
    
  // }
  // startStopDown(){
  //   this.isDisabled = true;
  //   axios.post('api/solarPanelControl/startStopElevation',{
  //     direction:"Down",
  //   }).then(()=>{
  //     this.isDisabled = false;
  //   });
    
  // }
 
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
