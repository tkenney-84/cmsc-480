import axios from 'axios';
import { environment } from 'src/environments/environment.local';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {

  constructor() {}

  ngOnInit(): void {

    /**
     * Interceptor to catch all http and https requests from the front end and
     * scan them for API requests. If a request contains api/ in the url, it
     * will be modified and rebased to environment.apiURL. This is a healthy
     * workaround for port opening issues.
     *
     * If you remove this, you destroy the bridge between the front end and
     * back end. This is a critical chunk of code.
     */
    axios.interceptors.request.use(function (request) {

        // If the request url is null, reject the request.
        if (request.url == null) {
          return Promise.reject("INTERCEPTOR: Null Request");
        }

        // This was here to ensure this interceptor was working.
        // console.log("API Request Modfiied: ", request.url + " to " + `${environment.apiURL}${request.url.slice(request.url.indexOf('api/') + ((environment.production) ? 0 : 4))}`, request);

        // If the request url contains api/, modify the request url.
        if (request.url.includes('api/')) {
            request.url = `${environment.apiURL}${request.url.slice(request.url.indexOf('api/') + ((environment.production) ? 0 : 4))}`;
        }

        // Return the potentially modified request.
        return request;

    }, function (error) {
        return Promise.reject(error);
    });
  }

}
