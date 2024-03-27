import { Component, Inject, Renderer2, OnDestroy, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-captcha-widget',
  templateUrl: './captcha-widget.component.html',
  styleUrls: ['./captcha-widget.component.scss'],
})
export class CaptchaWidgetComponent  implements OnDestroy, OnInit {

  constructor(private renderer: Renderer2, @Inject(DOCUMENT) private document: Document) { }

  captchaImportReference: any;
  captchaRenderReference: any;

  validateCaptcha() {
    console.log("Captcha Validated");
  }

  ngOnInit() {
    this.captchaRenderReference = this.renderer.createElement('script');
    this.captchaRenderReference.text = `
    window.onloadTurnstileCallback = function () {
      turnstile.render('#captcha-widget', {
          sitekey: '0x4AAAAAAAVusuoIuJLlz3oM',
          callback: function(token) {
              console.log('Challenge Success ' + token);
          },
      });
    };
    `
    this.captchaRenderReference.type = 'text/javascript';

    // Optionally (if needed by the provider):
    // this.captchaRenderReference.async = true;
    // this.captchaRenderReference.defer = true;

    this.renderer.appendChild(this.document.head, this.captchaRenderReference);

    this.captchaImportReference = this.renderer.createElement('script');
    this.captchaImportReference.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onloadTurnstileCallback';
    this.captchaImportReference.type = 'text/javascript';

    // Optionally (if needed by the provider):
    // this.captchaImportReference.async = true;
    this.captchaImportReference.defer = true;

    this.renderer.appendChild(this.document.head, this.captchaImportReference);
  }

  ngOnDestroy() {
    // Locate the previously added script tag (e.g., by storing a reference).
    this.renderer.removeChild(this.document.head, this.captchaImportReference);
    this.renderer.removeChild(this.document.head, this.captchaRenderReference);
 }

}
