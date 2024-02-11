import { Component } from '@angular/core';
import { environment } from 'src/environments/environment.local';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor() {}

  host = environment.apiURL

}
