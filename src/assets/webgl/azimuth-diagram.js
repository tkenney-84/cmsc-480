const { default: axios } = require("axios");

//sun direction information

//in form RGBa
var sunPoints = [];
var sunColor=[1.0,0.0,0.0,1.0];
var sunAngle;

//solar panel information
var solarPoints= [];
var solarColor=[0.0, 0.0, 1.0, 1.0];
var solarAngle;

//both
var lineRadius=.75;

function initAzimuthDiagram() {

  // DON'T MODIFY CODE BELOW THIS POINT

  var globalCanvasID = "azimuth-canvas";

  if (document.getElementById(globalCanvasID) == null) {
    return null;
  }

  var instance = new WebGLResources(globalCanvasID);

  // Set up the WebGL canvas. If WebGL isn't available, display an error
  // message for the user.
  var gl = instance.WebGLUtils.setupWebGL();
  if (!gl) {
    console.error("WebGL",
      "WebGL isn't available on your browser or with your current computer."
    );
  }

  //get values (random at the moment)
   axios.get(`${this.baseURL}/sendRandomNumbers`).then((response)=>{
    sunPoints = response.data.randomNumbers;
   });
   axios.get(`${this.baseURL}/sendRandomNumbers`).then((response)=>{
    solarPoints = response.data.randomNumbers;
   });

   //center
   sunPoints.push(0,0);
   solarPoints.push(0,0);

   //convert degrees to radians then to cordinates
   sunPoints[0]=lineRadius*Math.cos(sunPoints[0]*Math.PI/180);
   sunPoints[1]=lineRadius*Math.sin(sunPoints[1]*Math.PI/180);
   solarPoints[0]=lineRadius*Math.cos(solarPoints[0]*Math.PI/180);
   solarPoints[1]=lineRadius*Math.sin(solarPoints[1]*Math.PI/180);

   //merge sun points and solar points for vertex buffer
   for(var i=0; i<4; i++){
    sunPoints[i+4]=solarPoints[i];
    console.log(sunPoints[i]);
   }

   //merge color buffer 
   //future update

   // Convert the points array to a Float32Array.

  var finalArray = new Float32Array(sunPoints);

  // Set up the canvas.
  var dimensions = instance.canvasDimensions();
  gl.viewport(0, 0, dimensions.width, dimensions.height);
  gl.clearColor(1.0, 1.0, 1.0, 1.0);

  // Shader customization is available in the root project directory's index.html file.
  // DON'T MODIFY CODE BELOW THIS POINT
  var program = instance.initShaders(gl, "azimuth-vertex-shader", "azimuth-fragment-shader");
  // DO NOT MODIFY CODE ABOVE THIS POINT

  gl.useProgram(program);

  // Set the fragment color with a uniform.
  var u_FragColor = gl.getUniformLocation(program, 'u_FragColor');
  gl.uniform4f(u_FragColor, 1.0, 0.0, 0.0, 1.0);

  // Load the data into the GPU.
  var bufferId = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
  gl.bufferData(gl.ARRAY_BUFFER, finalArray, gl.STATIC_DRAW);

  // Associate the shader variables with the buffer data.
  var vPosition = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);

  render(gl);
};

function render(gl) {

  // Clear the canvas.
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Draw the points.
  gl.drawArrays(gl.LINES, 0, 2);
  gl.drawArrays(gl.LINES, 4, 2);
}

