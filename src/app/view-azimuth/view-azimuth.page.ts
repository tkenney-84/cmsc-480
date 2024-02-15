import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-view-azimuth',
  templateUrl: './view-azimuth.page.html',
  styleUrls: ['./view-azimuth.page.scss'],
})
export class ViewAzimuthPage implements OnInit {

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


  constructor() { }

  ngOnInit() {
  }

}
