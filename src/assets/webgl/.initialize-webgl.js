/**
 * @fileOverview Renders a canvas and its elements with WebGL.
 *
 * This file assumes that the following files are included in the HTML file:
 * .shared.js
 */

/**
 * This function is called when the HTML file is loaded. It initializes the
 * WebGL canvas and renders the provided canvas elements.
 * @returns { void }
 */
window.onload = function init() {
  initAzimuthDiagram();
  initElevationDiagram();
};
