function initAzimuthDiagram() {

  var instance = new WebGLResources("azimuth-canvas");

  // Set up the WebGL canvas. If WebGL isn't available, display an error
  // message for the user.
  var gl = instance.WebGLUtils.setupWebGL();
  if (!gl) {
    instance.showErrorText(
      "WebGL isn't available on your browser or with your current computer."
    );
  }

  gl.numPoints = 3;

  // An array of points to be rendered on the canvas.
  var points = [];

  // Fill the points array with coordinates.
  for (var i = 0; i < gl.numPoints; i++) {
    var coordinate = instance.random2DCoordinate();
    points.push(coordinate.x, coordinate.y);
  }

  // Convert the points array to a Float32Array.
  var finalArray = new Float32Array(points);

  // Set up the canvas.
  var dimensions = instance.canvasDimensions();
  gl.viewport(0, 0, dimensions.width, dimensions.height);
  gl.clearColor(1.0, 1.0, 1.0, 1.0);

  // Initialize the shaders.
  var program = instance.initShaders(gl, "azimuth-vertex-shader", "azimuth-fragment-shader");
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
  gl.drawArrays(gl.TRIANGLES, 0, gl.numPoints);
}
