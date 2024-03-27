import { Component, Inject, Renderer2, OnDestroy, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-webgl-azimuth',
  templateUrl: './webgl-azimuth.component.html',
  styleUrls: ['./webgl-azimuth.component.scss'],
})
export class WebglAzimuthComponent  implements OnInit, OnDestroy {

  constructor(private renderer: Renderer2, @Inject(DOCUMENT) private document: Document) { }

  webGLAzimuthFragmentShaderReference: any;
  webGLAzimuthVertexShaderReference: any;
  webGLAzimuthReference: any;

  ngOnInit() {

    this.webGLAzimuthFragmentShaderReference = this.renderer.createElement('script');
    this.webGLAzimuthFragmentShaderReference.text = `
      precision mediump float;
      varying vec4 fColor;
      void main() {
          gl_FragColor = fColor;

      }
    `
    this.webGLAzimuthFragmentShaderReference.type = 'x-shader/x-fragment';
    this.webGLAzimuthFragmentShaderReference.id = 'azimuth-fragment-shader';

    this.renderer.appendChild(this.document.head, this.webGLAzimuthFragmentShaderReference);

    this.webGLAzimuthVertexShaderReference = this.renderer.createElement('script');
    this.webGLAzimuthVertexShaderReference.text = `
      attribute vec4 vPosition;
      attribute vec4 vColor;
      varying vec4 fColor;
      void main() {
          gl_Position = vPosition;
          gl_PointSize = 5.0;
          fColor=vColor;
      }
    `
    this.webGLAzimuthVertexShaderReference.type = 'x-shader/x-vertex';
    this.webGLAzimuthVertexShaderReference.id = 'azimuth-vertex-shader';

    this.renderer.appendChild(this.document.head, this.webGLAzimuthVertexShaderReference);

    this.webGLAzimuthReference = this.renderer.createElement('script');
    this.webGLAzimuthReference.src = '../../assets/webgl/azimuth-diagram.js';
    this.webGLAzimuthReference.type = 'text/javascript';

    this.webGLAzimuthReference.defer = true;

    this.renderer.appendChild(this.document.head, this.webGLAzimuthReference);

  }

  ngOnDestroy() {
    this.renderer.removeChild(this.document.head, this.webGLAzimuthReference);
    this.renderer.removeChild(this.document.head, this.webGLAzimuthVertexShaderReference);
    this.renderer.removeChild(this.document.head, this.webGLAzimuthFragmentShaderReference);
  }

}
