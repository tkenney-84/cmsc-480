import { Component, OnInit } from '@angular/core';
import axios from 'axios';
import { environment } from 'src/environments/environment.local';

@Component({
  selector: 'app-mainpage',
  templateUrl: './mainpage.page.html',
  styleUrls: ['./mainpage.page.scss'],
})
export class MainpagePage implements OnInit {

  constructor() { }
  baseURL: string = environment.apiURL;
  randomNumbers:string[] = [];
  lat:number = 0;
  long:number = 0;
  altitude:number = 0;
  azimuth:number =0;
  getRandomNumbers(){
    axios.get(`${this.baseURL}/sendRandomNumbers`).then((response)=>{
      let arr = response.data.randomNumbers;
     
      this.randomNumbers = arr;
    })
  }
  sendLatLong(){


    axios.post(`${this.baseURL}/solarCoordinates`,{
      lat:this.lat,
      long:this.long
    }).then((response) =>{
      this.altitude = response.data.sunAltitude;
      this.azimuth = response.data.sunAzimuth;
      console.log(response.data);
    })
  }
  ngOnInit() {
  }

}
