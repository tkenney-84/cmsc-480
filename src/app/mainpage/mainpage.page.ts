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
  firstName:string = "";
  lastName:string = "";
  id:number= 0;
  solarPanelPosition:string = ""
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
  findUser(){
    axios.post(`${this.baseURL}/findUser`,{
      userId:this.id
    }).then((response) =>{
      console.log(response.data);
        this.firstName = response.data.rows[0].username;
        this.lastName  = response.data.rows[0].password;
    })
  }
  getSolarPanelPosition(){
      axios.get(`${this.baseURL}/getPanelPosition`).then((response) =>{
          console.log(response);
      }).catch((err) =>{
        console.log(err);
      });
      

  }
  ngOnInit() {
  }

}
