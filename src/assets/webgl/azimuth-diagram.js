setTimeout(function initAzimuthDiagram() {

  //sun direction information

  //in form RGBa
  var sunPoints = [0,0];
  var sunColor=[0.0,1.0,0.0,1.0,1.0,0.0];
  var sunAngle;

  //solar panel information
  var solarPoints= [0,0];
  var solarColor=[0.0, 0.0, 1.0];
  var solarAngle;

  //both
  var lineRadius=.75;

  // DON'T MODIFY CODE BELOW THIS POINT

  var globalCanvasID = "azimuth-canvas";

  if (document.getElementById(globalCanvasID) == null) {
    return null;
  }

  var instance = new WebGLResources(globalCanvasID);

  var apiURL = instance.getAPIUrl();

  // Set up the WebGL canvas. If WebGL isn't available, display an error
  // message for the user.
  var gl = instance.WebGLUtils.setupWebGL();
  if (!gl) {
    console.error("WebGL",
      "WebGL isn't available on your browser or with your current computer."
    );
  }

  //get values (random at the moment)
   axios.get(`${apiURL}/getAzimuthAngle`).then((response)=>{
    sunAngle = response.data.angle;

    //convert degrees to radians then to cordinates
    //x *-1 to flip over y axis
    sunPoints[2]=lineRadius*Math.cos(sunAngle*Math.PI/180)*-1;
    sunPoints[3]=lineRadius*Math.sin(sunAngle*Math.PI/180);
    axios.get(`${apiURL}/getAzimuthAngle`).then((response)=>{
      solarAngle = response.data.angle;

      solarPoints[2]=lineRadius*Math.cos(solarAngle*Math.PI/180)*-1;
      solarPoints[3]=lineRadius*Math.sin(solarAngle*Math.PI/180);

      //merge sun points and solar points for vertex buffer
      sunPoints.concat(solarPoints);

      //merge colors for buffer
      sunColor.concat(solarColor);


      // Convert the points array to a Float32Array.

     var finalArray = new Float32Array(sunPoints);
     var finalColors = new Float32Array(sunColor);

     // Set up the canvas.
     var dimensions = instance.canvasDimensions();
     gl.viewport(0, 0, dimensions.width, dimensions.height);
     gl.clearColor(1.0, 1.0, 1.0, 1.0);

     // Shader customization is available in the root project directory's index.html file.


     // DON'T MODIFY CODE BELOW THIS POINT
     var program = instance.initShaders(gl, "azimuth-vertex-shader", "azimuth-fragment-shader");
     // DO NOT MODIFY CODE ABOVE THIS POINT

     gl.useProgram(program);
     // Load the data into the GPU.
     var bufferId = gl.createBuffer();
     gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
     gl.bufferData(gl.ARRAY_BUFFER, finalArray, gl.STATIC_DRAW);

     // Associate the shader variables with the buffer data.
     var vPosition = gl.getAttribLocation(program, "vPosition");
     gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
     gl.enableVertexAttribArray(vPosition);

     //load color buffer
     var cBuffer = gl.createBuffer();
     gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
     gl.bufferData( gl.ARRAY_BUFFER, finalColors ,gl.STATIC_DRAW );

     var vColor = gl.getAttribLocation( program, "vColor" );
     gl.vertexAttribPointer( vColor, 3, gl.FLOAT, false, 0, 0 );
     gl.enableVertexAttribArray( vColor );

     // Clear the canvas.
     gl.clear(gl.COLOR_BUFFER_BIT);

     // Draw the points.
     gl.drawArrays(gl.LINES, 0, 2);

     });


   });
}, 0);
