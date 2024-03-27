import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, ViewContainerRef, Inject, Renderer2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import axios from 'axios';
import { CaptchaWidgetComponent } from '../captcha-widget/captcha-widget.component';
import { WebglAzimuthComponent } from '../webgl-azimuth/webgl-azimuth.component';
import { WebglElevationComponent } from '../webgl-elevation/webgl-elevation.component';
import { ToastService } from '../toast.service';
@Component({
  selector: 'app-move-solar-panel',
  templateUrl: './move-solar-panel.page.html',
  styleUrls: ['./move-solar-panel.page.scss'],
})

export class MoveSolarPanelPage implements AfterViewInit, OnDestroy, OnInit {

  @ViewChild('captchaWidget', { read: ViewContainerRef }) captchaWidgetRef!: ViewContainerRef;

  @ViewChild('webGLAzimuth', { read: ViewContainerRef }) webGLAzimuthRef!: ViewContainerRef;

  @ViewChild('webGLElevation', { read: ViewContainerRef }) webGLElevationRef!: ViewContainerRef;

  webGLResourcesReference: any;

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
  constructor(private renderer: Renderer2, @Inject(DOCUMENT) private document: Document, private toast: ToastService) { }

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

  /**
   * Reloads the WebGL components.
   */
  async reloadWebGL() {
    this.webGLAzimuthRef.clear();
    this.webGLElevationRef.clear();
    this.webGLAzimuthRef.createComponent(WebglAzimuthComponent);
    this.webGLElevationRef.createComponent(WebglElevationComponent);

    this.toast.fireToast('success', 'WebGL components reloaded successfully.');

  }

  ngOnInit() {

    // Make the reload web gl function available in the global scope.
    // Hence making it available to the WebGL JS files.
    (window as any)['reloadWebGL'] = this.reloadWebGL.bind(this);

    // Import the WebGL resources script for use.
    this.webGLResourcesReference = this.renderer.createElement('script');
    this.webGLResourcesReference.src = '../../assets/webgl/.webgl-resources.js';
    this.webGLResourcesReference.type = 'text/javascript';
    this.renderer.appendChild(this.document.head, this.webGLResourcesReference);
  }

  ngAfterViewInit() {
    this.captchaWidgetRef.clear();
    this.captchaWidgetRef.createComponent(CaptchaWidgetComponent);
    this.reloadWebGL();
  }

  ngOnDestroy() {

    // Remove the WebGL resources script from the DOM.
    this.renderer.removeChild(this.document.head, this.webGLResourcesReference);

    // Remove the reloadWebGL function from the global scope.
    delete (window as any)['reloadWebGL'];
  }

}
