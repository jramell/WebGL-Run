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

/**
 *
 * @param options contains between 0 and all of the following:
 *          'baseColor': {r, g, b},
 *          'leftFaceColor': {r, g, b}
 *          'rightFaceColor': {r, g, b}
 *          'frontFaceColor': {r, g, b}
 *
 * @returns {{vertices: *, indices: number[]}}
 */
function createPyramid(options=null) {
    let baseColor = options && options['baseColor'] || {r: 0.5, g: 0.5, b: 0.5};
    let leftFaceColor = options && options['leftFaceColor'] || {r: 0.75, g: 0.25, b: 0.5};
    let rightFaceColor = options && options['rightFaceColor'] || {r: 0.25, g: 0.25, b: 0.75};
    let frontFaceColor = options && options['frontFaceColor'] || {r: 1.0, g: 0.0, b: 0.15};
    let backFaceColor = options && options['backFaceColor'] || {r: 1.0, g: 1.0, b: 0.15};

    const vertices =
        [ // X, Y, Z           R, G, B
            //Base
            -1.0, 1.0, -1.0,   baseColor['r'], baseColor['g'], baseColor['b'],
            -1.0, 1.0, 1.0,    baseColor['r'], baseColor['g'], baseColor['b'],
            1.0, 1.0, 1.0,     baseColor['r'], baseColor['g'], baseColor['b'],
            1.0, 1.0, -1.0,    baseColor['r'], baseColor['g'], baseColor['b'],

            // Left
            -1.0, 1.0, -1.0,   leftFaceColor['r'], leftFaceColor['g'], leftFaceColor['b'],
            -1.0, 1.0,  1.0,   leftFaceColor['r'], leftFaceColor['g'], leftFaceColor['b'],
            0.0, 3.0,  0.0,    leftFaceColor['r'], leftFaceColor['g'], leftFaceColor['b'],

            // Right
            1.0, 1.0, 1.0,     rightFaceColor['r'], rightFaceColor['g'], rightFaceColor['b'],
            1.0, 1.0, -1.0,    rightFaceColor['r'], rightFaceColor['g'], rightFaceColor['b'],
            0.0, 3.0,  0.0,    rightFaceColor['r'], rightFaceColor['g'], rightFaceColor['b'],

            // Front
            -1.0, 1.0, 1.0,    frontFaceColor['r'], frontFaceColor['g'], frontFaceColor['b'],
             1.0, 1.0, 1.0,    frontFaceColor['r'], frontFaceColor['g'], frontFaceColor['b'],
             0.0, 3.0,  0.0,   frontFaceColor['r'], frontFaceColor['g'], frontFaceColor['b'],

            // Back
            -1.0, 1.0, -1.0,   backFaceColor['r'], backFaceColor['g'], backFaceColor['b'],
             1.0, 1.0, -1.0,   backFaceColor['r'], backFaceColor['g'], backFaceColor['b'],
             0.0, 3.0,  0.0,   backFaceColor['r'], backFaceColor['g'], backFaceColor['b'],
        ];

    const indices = [
        0, 1, 2,   0, 2, 3, //base
        4, 5, 6,  //left
        7, 8, 9,  //right
        10, 11, 12, //front
        13, 14, 15 //back
    ];

    return {
        vertices: vertices,
        indices: indices
    };
}

function distance(a, b) {
    let x = b[0] - a[0];
    let y = b[1] - a[1];
    let z = b[2] - a[2];
    return Math.sqrt(x*x + y*y + z*z);
}

function abs(number) {
    if(number < 0) {
        number *= -1;
    }
    return number;
}