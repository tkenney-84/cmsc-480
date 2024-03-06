import { Component, OnInit } from '@angular/core';
import axios from 'axios';
import { environment } from 'src/environments/environment.local';

@Component({
  selector: 'app-homepage',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {


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
  leftArrow:string="<---"
  rightArrow:string="--->"
  createUsername:string=""
  createPassword:string=""
  username:string = ""
  password:string =""
  userType:string = ""
  successfulCreatedUser:boolean=false
  getRandomNumbers(){
    axios.get(`api/sendRandomNumbers`).then((response)=>{
      let arr = response.data.randomNumbers;

      this.randomNumbers = arr;
    })
  }


  toGraph(){

  }

  sendLatLong(){


    axios.post(`api/solarCoordinates`,{
      lat:this.lat,
      long:this.long
    }).then((response) =>{
      this.altitude = response.data.sunAltitude;
      this.azimuth = response.data.sunAzimuth;
      console.log(response.data);
    })
  }
  findUser(){
    axios.post(`api/findUser`,{
      userId:this.id
    }).then((response) =>{
      console.log(response.data);
        this.firstName = response.data.rows[0].username;
        this.lastName  = response.data.rows[0].password;
    })
  }
  createUser(){
    axios.post(`api/createUser`,{
      createUsername:this.createUsername,
      createPassword:this.createPassword,
      isSuccessful:this.successfulCreatedUser
    }).then((response) =>{
      console.log(response.data);
      this.successfulCreatedUser = response.data.isSuccessful;
    })
  }
  getSolarPanelPosition(){
      axios.get(`api/getPanelPosition`).then((response) =>{
          console.log(response);
      }).catch((err) =>{
        console.log(err);
      });
  }
  getAccessKey(){
    console.log(this.username);
    console.log(this.userType);
    axios.post('api/loginSolar',{
      username:this.username,
      password:this.password,
      userType:this.userType
    }).then(function(response){
      console.log(response)
    })


  }

  ngOnInit() {
    return; // This'll shut the linter up.
  }

}
