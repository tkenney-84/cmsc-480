import { AfterViewInit, Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import axios from 'axios';
import { response } from 'express';
import { CaptchaWidgetComponent } from '../captcha-widget/captcha-widget.component';
@Component({
  selector: 'app-move-solar-panel',
  templateUrl: './move-solar-panel.page.html',
  styleUrls: ['./move-solar-panel.page.scss'],
})

export class MoveSolarPanelPage implements AfterViewInit {

  @ViewChild('captchaWidget', { read: ViewContainerRef }) captchaWidgetRef!: ViewContainerRef;


  isDivVisible:boolean = false;
  toggleDiv()
  {
    this.isDivVisible = !this.isDivVisible;
  }

  hide1:boolean = true;
  ngIfCtrl1(){
    this.hide1 = !this.hide1;
  }

  hide2:boolean = true;
  ngIfCtrl2(){
    this.hide2 = !this.hide2;
  }

  hide3:boolean = true;
  ngIfCtrl3(){
    this.hide3 = !this.hide3;
  }

  hide4:boolean = true;
  ngIfCtrl4(){
    this.hide4 = !this.hide4;
  }


  isDisabled:boolean = false;
  constructor() { }

  movePanel(event: MouseEvent){
    this.isDisabled = true;

    const directionButton = event.target as HTMLButtonElement;
    var buttonVal = directionButton.textContent;

    console.log(buttonVal)

    if(buttonVal?.match('Right') !== null || buttonVal?.match('Left') !== null){

      axios.post('api/solarPanelControl/movePanel',{
        direction:buttonVal,
        duration:3000
      }).then(()=>{
        console.log("line 26");
         this.isDisabled = false;

      }).catch((err)=>{

        console.log("Error: "  +err)
      });
    }else{

      axios.post('api/solarPanelControl/movePanel',{
        direction:buttonVal,
        duration:4000
      }).then(()=>{
        console.log("Line 37")
         this.isDisabled = false;
      }).catch((err)=>{
        console.log("Error: "  +err)
      });
    }

  }
  resetPanel(){
    this.isDisabled = true
    axios.post("api/solarPanelControl/reset").then((response) =>{
      this.isDisabled = false
    })
  }

  ngAfterViewInit() {
    this.captchaWidgetRef.clear();
    this.captchaWidgetRef.createComponent(CaptchaWidgetComponent);
  }

}
