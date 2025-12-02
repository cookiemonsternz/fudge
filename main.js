'use strict';

/**
 * Resizes the canvas's pixel size to fit its display size.
 * @param {HTMLCanvasElement} canvas The rendering canvas
 * @returns 
 */
function resizeCanvasToDisplaySize(canvas) {
    const displayWidth  = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;
    
    // Check if the canvas is not the same size.
    const needResize = canvas.width  !== displayWidth ||
                        canvas.height !== displayHeight;
    
    if (needResize) {
    // Make the canvas the same size
    canvas.width  = displayWidth;
    canvas.height = displayHeight;
    }
    
    return needResize;
}

var canvas = document.querySelector("#c");
resizeCanvasToDisplaySize(canvas);

var gl = canvas.getContext("webgl2");
if (!gl) {
    // No webgl support
    var webgl_warning = document.querySelector("#no-webgl");
    webgl_warning.style.display = "block";
}

/**
 * Creates and compiles a shader.
 *
 * @param {!WebGLRenderingContext} gl The WebGL Context.
 * @param {string} shaderSource The GLSL source code for the shader.
 * @param {number} shaderType The type of shader, VERTEX_SHADER or
 *     FRAGMENT_SHADER.
 * @return {!WebGLShader} The shader.
 */
function compileShader(gl, shaderSource, shaderType) {
    // Create the shader object
    var shader = gl.createShader(shaderType);
    
    // Set the shader source code.
    gl.shaderSource(shader, shaderSource);
    
    // Compile the shader
    gl.compileShader(shader);
    
    // Check if it compiled
    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!success) {
    // Something went wrong during compilation; get the error
    throw ("could not compile shader:" + gl.getShaderInfoLog(shader));
    }
    
    return shader;
}

/**
 * Creates a shader from the content of a script tag.
 *
 * @param {!WebGLRenderingContext} gl The WebGL Context.
 * @param {string} scriptId The id of the script tag.
 * @param {string} opt_shaderType. The type of shader to create.
 *     If not passed in will use the type attribute from the
 *     script tag.
 * @return {!WebGLShader} A shader.
 */
function createShaderFromScript(gl, scriptId, opt_shaderType) {
    // look up the script tag by id.
    var shaderScript = document.getElementById(scriptId);
    if (!shaderScript) {
    throw("*** Error: unknown script element" + scriptId);
    }
    
    // extract the contents of the script tag.
    var shaderSource = shaderScript.src;
    
    // If we didn't pass in a type, use the 'type' from
    // the script tag.
    if (!opt_shaderType) {
    if (shaderScript.type == "x-shader/x-vertex") {
        opt_shaderType = gl.VERTEX_SHADER;
    } else if (shaderScript.type == "x-shader/x-fragment") {
        opt_shaderType = gl.FRAGMENT_SHADER;
    } else if (!opt_shaderType) {
        throw("*** Error: shader type not set");
    }
    }
    
    return compileShader(gl, shaderSource, opt_shaderType);
};

/**
 * Creates a program from a vertex and fragment shader
 * @param {!WebGLRenderingContext} gl The WebGL Context
 * @param {!WebGLShader} vShader The vertex shader object
 * @param {!WebGLShader} fShader The fragment shader object
 * @returns {!WebGLProgram} A program
 */
function create_program(gl, vShader, fShader) {
    var program = gl.createProgram();
    gl.attachShader(program, vShader);
    gl.attachShader(program, fShader);
    gl.linkProgram(program);

    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
        return program;
    }

    console.error("Program linking failed: ", gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
}

/**
 * Creates a program from 2 script tags.
 *
 * @param {!WebGLRenderingContext} gl The WebGL Context.
 * @param {string} vertexShaderId The id of the vertex shader script tag.
 * @param {string} fragmentShaderId The id of the fragment shader script tag.
 * @return {!WebGLProgram} A program
 */
function createProgramFromScripts(
    gl, vertexShaderId, fragmentShaderId) {
    var vertexShader = createShaderFromScript(gl, vertexShaderId, gl.VERTEX_SHADER);
    var fragmentShader = createShaderFromScript(gl, fragmentShaderId, gl.FRAGMENT_SHADER);
    return createProgram(gl, vertexShader, fragmentShader);
}

var program = createProgramFromScripts(gl, "vs", "fs");

// Get attribute positions
var positionAttributeLocation = gl.getAttribLocation(program, "a_position");

// Create buffers
var positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

// Add buffer data
var positions = [
    10, 20,
    80, 20,
    10, 30,
    10, 30,
    80, 20,
    80, 30,
];
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

// VAO
var vao = gl.createVertexArray();
gl.bindVertexArray(vao);
gl.enableVertexAttribArray(positionAttributeLocation);

var size = 2; // 2 components per data point
var type = gl.FLOAT; // 32 bit float
var normalize = false;
var stride = 0; // 0 means stride of size * sizeof(type)
var offset = 0;
gl.vertexAttribPointer(
    positionAttributeLocation, size, type, normalize, stride, offset);

// Uniforms setup
// get uniform locations
var resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");

gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
gl.clearColor(0, 0, 0 , 0);
gl.clear(gl.COLOR_BUFFER_BIT);

gl.useProgram(program);

gl.bindVertexArray(vao);
gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

var primitiveType = gl.TRIANGLES;
var offset = 0;
var count = 6;
gl.drawArrays(primitiveType, offset, count);