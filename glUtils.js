function getHTMLScriptWithId(id) {
    var script = document.getElementById(id);
    return script ? script.text : id;
}

/**
 * Creates and returns a WebGLProgram whose vertex and fragment shaders have the sources passed as a paramete
 * @param gl
 * @param vertexShaderSource
 * @param fragmentShaderSource
 * @returns {WebGLProgram}
 */
function getWebGLProgram(gl, vertexShaderSource, fragmentShaderSource) {
    var vertexShader = setupShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
    var fragmentShader = setupShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER);
    var webGLProgram = gl.createProgram();
    //No need to specify which shader is the vertex shader and which is the fragment shader, the WebGL API already knows.
    gl.attachShader(webGLProgram, vertexShader);
    gl.attachShader(webGLProgram, fragmentShader);
    gl.linkProgram(webGLProgram);
    if(!gl.getProgramParameter(webGLProgram, gl.LINK_STATUS)) {
        console.log("Error linking WebGLProgram", gl.getProgramInfoLog(webGLProgram));
    }
    //The next step is apparently expensive and should only be done in debug builds
    gl.validateProgram(webGLProgram);
    if(!gl.getProgramParameter(webGLProgram, gl.VALIDATE_STATUS)) {
        console.error("Error validating WebGLProgram", gl.getProgramInfoLog(webGLProgram));
    }
    return webGLProgram;
}

/**
 * Creates a WebGLShader object of shaderType from shaderSource if its source compiles. If it doesn't prints errors in console.
 * @param gl WebGLContext
 * @param shaderSource source of the WebGLShader to create.
 * @param shaderType the type of the WebGLShader to create. Will usually be either gl.FRAGMENT_SHADER or gl.VERTEX_SHADER
 * @returns {WebGLShader}
 */
function setupShader(gl, shaderSource, shaderType) {
    var shader = gl.createShader(shaderType);
    gl.shaderSource(shader, shaderSource);
    gl.compileShader(shader);
    if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Error compiling vertex shader", gl.getShaderInfoLog(shader));
    }
    return shader;
}

function clearCanvas(gl, r, g, b, a) {
    gl.clearColor(r, g, b, a);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

function createCube() {
    const vertices = [
        // Front face
        -1.0, -1.0,  1.0,
        1.0, -1.0,  1.0,
        1.0,  1.0,  1.0,
        -1.0,  1.0,  1.0,

        // Back face
        -1.0, -1.0, -1.0,
        -1.0,  1.0, -1.0,
        1.0,  1.0, -1.0,
        1.0, -1.0, -1.0,

        // Top face
        -1.0,  1.0, -1.0,
        -1.0,  1.0,  1.0,
        1.0,  1.0,  1.0,
        1.0,  1.0, -1.0,

        // Bottom face
        -1.0, -1.0, -1.0,
        1.0, -1.0, -1.0,
        1.0, -1.0,  1.0,
        -1.0, -1.0,  1.0,

        // Right face
        1.0, -1.0, -1.0,
        1.0,  1.0, -1.0,
        1.0,  1.0,  1.0,
        1.0, -1.0,  1.0,

        // Left face
        -1.0, -1.0, -1.0,
        -1.0, -1.0,  1.0,
        -1.0,  1.0,  1.0,
        -1.0,  1.0, -1.0,
    ];

    const indices = [
        0,  1,  2,      0,  2,  3,    // front
        4,  5,  6,      4,  6,  7,    // back
        8,  9,  10,     8,  10, 11,   // top
        12, 13, 14,     12, 14, 15,   // bottom
        16, 17, 18,     16, 18, 19,   // right
        20, 21, 22,     20, 22, 23,   // left
    ];

    return {
        vertices: vertices,
        indices: indices
    };
}