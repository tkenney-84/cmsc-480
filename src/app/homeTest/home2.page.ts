import { Component } from '@angular/core';
import { environment } from 'src/environments/environment.local';
import axios from 'axios';

@Component({
  selector: 'app-home',
  templateUrl: 'home2.page.html',
  styleUrls: ['home2.page.scss'],
})
export class HomePage2 {

  constructor() {}

  baseURL: string = environment.apiURL
  getReqBody: string = "";
  postReqBody: string = "";
  postResultText: string = "POST request result will appear here.";
  getResultText: string = "GET request result will appear here.";
  // baseURL: string = "https://test.kenneydiaz.net:2024";

  sendPOST() {
    axios.post(`api/testPost`, { name: this.postReqBody }).then((response) => {
      console.log(response);
      this.postResultText = response.data;
    }).catch((error) => {
      console.log(error);
    });
  }

  sendGET() {
    axios.get(`api/testGet?record=${this.getReqBody}`).then((response) => {
      console.log(response);
      this.getResultText = response.data;
    }).catch((error) => {
      console.log(error);
    });
  }

}
