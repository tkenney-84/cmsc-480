import { Component, Inject, Renderer2, OnDestroy, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-webgl-elevation',
  templateUrl: './webgl-elevation.component.html',
  styleUrls: ['./webgl-elevation.component.scss'],
})
export class WebglElevationComponent  implements OnInit, OnDestroy {

  constructor(private renderer: Renderer2, @Inject(DOCUMENT) private document: Document) { }

  webGLElevationFragmentShaderReference: any;
  webGLElevationVertexShaderReference: any;
  webGLElevationReference: any;

  ngOnInit() {

    this.webGLElevationFragmentShaderReference = this.renderer.createElement('script');
    this.webGLElevationFragmentShaderReference.text = `
      precision mediump float;
      varying vec4 fColor;
      void main() {
          gl_FragColor = fColor;
      }
    `
    this.webGLElevationFragmentShaderReference.type = 'x-shader/x-fragment';
    this.webGLElevationFragmentShaderReference.id = 'elevation-fragment-shader';

    this.renderer.appendChild(this.document.head, this.webGLElevationFragmentShaderReference);

    this.webGLElevationVertexShaderReference = this.renderer.createElement('script');
    this.webGLElevationVertexShaderReference.text = `
      attribute vec4 vPosition;
      attribute vec4 vColor;
      varying vec4 fColor;
      void main() {
          gl_Position = vPosition;
          fColor=vColor;
      }
    `
    this.webGLElevationVertexShaderReference.type = 'x-shader/x-vertex';
    this.webGLElevationVertexShaderReference.id = 'elevation-vertex-shader';

    this.renderer.appendChild(this.document.head, this.webGLElevationVertexShaderReference);

    this.webGLElevationReference = this.renderer.createElement('script');
    this.webGLElevationReference.src = '../../assets/webgl/elevation-diagram.js';
    this.webGLElevationReference.type = 'text/javascript';

    this.webGLElevationReference.defer = true;

    this.renderer.appendChild(this.document.head, this.webGLElevationReference);

  }

  ngOnDestroy() {

    this.renderer.removeChild(this.document.head, this.webGLElevationReference);
    this.renderer.removeChild(this.document.head, this.webGLElevationVertexShaderReference);
    this.renderer.removeChild(this.document.head, this.webGLElevationFragmentShaderReference);
  }

}
