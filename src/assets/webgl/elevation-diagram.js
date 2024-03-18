function initElevationDiagram() {

  var lineLength = 0.85;
  var linePoints = [0, 0];
  var colors = [1.0,1.0,0.0,1.0,1.0,0.0];
  // DON'T MODIFY CODE BELOW THIS POINT

  var globalCanvasID = "elevation-canvas";

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
  // DO NOT MODIFY CODE ABOVE THIS POINT

  //get values (random at the moment)
  axios.get(`${apiURL}/getElevationAngle`).then((response)=>{

    var lineAngle = response.data.angle;

    var lineX = lineLength * Math.cos(lineAngle * (Math.PI / 180));
    var lineY = lineLength * Math.sin(lineAngle * (Math.PI / 180));

    linePoints.push(lineX, lineY);

    // Convert the points array to a Float32Array.
    var finalArray = new Float32Array(linePoints);
    var finalColors = new Float32Array(colors);
    // Set up the canvas.
    var dimensions = instance.canvasDimensions();
    gl.viewport(0, 0, dimensions.width, dimensions.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    // Shader customization is available in the root project directory's index.html file.
    // DON'T MODIFY CODE BELOW THIS POINT
    var program = instance.initShaders(gl, "elevation-vertex-shader", "elevation-fragment-shader");
    gl.useProgram(program);

    // DO NOT MODIFY CODE ABOVE THIS POINT


    // Set the fragment color with a uniform.
    //var u_FragColor = gl.getUniformLocation(program, 'u_FragColor');
    //gl.uniform4f(u_FragColor, 1.0, 0.0, 0.0, 1.0);

    // Load the data into the GPU.
    var bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, finalArray, gl.STATIC_DRAW);

    // Associate the shader variables with the buffer data.
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, finalColors ,gl.STATIC_DRAW );
 
    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );
  

    //render
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.LINES, 0, 2);
  });
};
