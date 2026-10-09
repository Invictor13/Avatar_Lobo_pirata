(() => {
  "use strict";

  const { geometry } = window.LoboPirata;

  const vertexShader = `
    attribute vec3 aPosition;
    attribute vec3 aNormal;
    attribute vec3 aColor;
    uniform mat4 uMvp;
    uniform mat4 uModel;
    uniform mat3 uNormalMatrix;
    uniform float uWireframe;
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec3 vColor;
    void main() {
      vec4 worldPosition = uModel * vec4(aPosition, 1.0);
      vPosition = worldPosition.xyz;
      vNormal = normalize(uNormalMatrix * aNormal);
      vColor = aColor;
      gl_Position = uMvp * vec4(aPosition, 1.0);
      if (uWireframe > 0.5) gl_Position.z -= 0.001 * gl_Position.w;
    }
  `;

  const fragmentShader = `
    precision highp float;
    uniform vec3 uColor;
    uniform float uRoughness;
    uniform float uWireframe;
    uniform vec3 uCamera;
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec3 vColor;

    float hash(vec3 p) {
      p = fract(p * 0.3183099 + vec3(0.1, 0.17, 0.13));
      p *= 17.0;
      return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
    }

    float noise(vec3 p) {
      vec3 i = floor(p);
      vec3 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      return mix(
        mix(mix(hash(i), hash(i + vec3(1, 0, 0)), f.x),
            mix(hash(i + vec3(0, 1, 0)), hash(i + vec3(1, 1, 0)), f.x), f.y),
        mix(mix(hash(i + vec3(0, 0, 1)), hash(i + vec3(1, 0, 1)), f.x),
            mix(hash(i + vec3(0, 1, 1)), hash(i + vec3(1, 1, 1)), f.x), f.y),
        f.z
      );
    }

    void main() {
      if (uWireframe > 0.5) {
        gl_FragColor = vec4(1.0, 0.6, 0.1, 0.85);
        return;
      }
      vec3 normal = normalize(vNormal);
      vec3 lightA = normalize(vec3(0.0, 0.6, 0.8));
      vec3 lightB = normalize(vec3(-0.6, 0.3, 0.5));
      vec3 lightC = normalize(vec3(0.6, -0.4, 0.5));
      float diffuse = max(dot(normal, lightA), 0.0);
      float fillA = max(dot(normal, lightB), 0.0);
      float fillB = max(dot(normal, lightC), 0.0);
      vec3 viewDirection = normalize(uCamera - vPosition);
      vec3 halfVector = normalize(lightA + viewDirection);
      float gloss = pow(max(dot(normal, halfVector), 0.0), mix(12.0, 96.0, 1.0 - uRoughness));
      float subtleNoise = noise(vPosition * 20.0) * 0.05;
      vec3 pigment = uColor * vColor * (0.95 + subtleNoise);
      float rim = pow(1.0 - max(dot(normal, viewDirection), 0.0), 2.2);
      vec3 color = pigment * (0.35 + 0.68 * diffuse + 0.18 * fillA + 0.12 * fillB);
      color += vec3(1.0, 0.72, 0.25) * gloss * (1.0 - uRoughness) * 0.8;
      color += vec3(1.0, 0.45, 0.05) * rim * 0.55;
      gl_FragColor = vec4(color, 1.0);
    }
  `;

  function compile(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const message = gl.getShaderInfoLog(shader) || "Falha ao compilar shader WebGL.";
      gl.deleteShader(shader);
      throw new Error(message);
    }
    return shader;
  }

  function program(gl) {
    const vertex = compile(gl, gl.VERTEX_SHADER, vertexShader);
    const fragment = compile(gl, gl.FRAGMENT_SHADER, fragmentShader);
    const result = gl.createProgram();
    gl.attachShader(result, vertex);
    gl.attachShader(result, fragment);
    gl.linkProgram(result);
    gl.deleteShader(vertex);
    gl.deleteShader(fragment);
    if (!gl.getProgramParameter(result, gl.LINK_STATUS)) {
      const message = gl.getProgramInfoLog(result) || "Falha ao iniciar o renderizador WebGL.";
      gl.deleteProgram(result);
      throw new Error(message);
    }
    return result;
  }

  function identity() {
    return new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
  }

  function multiply(a, b) {
    const out = new Float32Array(16);
    for (let column = 0; column < 4; column++) {
      for (let row = 0; row < 4; row++) {
        out[column * 4 + row] =
          a[row] * b[column * 4] +
          a[4 + row] * b[column * 4 + 1] +
          a[8 + row] * b[column * 4 + 2] +
          a[12 + row] * b[column * 4 + 3];
      }
    }
    return out;
  }

  function transform(node) {
    const [x, y, z] = node.rotation;
    const [sx, sy, sz] = node.scale;
    const cx = Math.cos(x), sinX = Math.sin(x);
    const cy = Math.cos(y), sinY = Math.sin(y);
    const cz = Math.cos(z), sinZ = Math.sin(z);
    const rotationX = new Float32Array([1, 0, 0, 0, 0, cx, sinX, 0, 0, -sinX, cx, 0, 0, 0, 0, 1]);
    const rotationY = new Float32Array([cy, 0, -sinY, 0, 0, 1, 0, 0, sinY, 0, cy, 0, 0, 0, 0, 1]);
    const rotationZ = new Float32Array([cz, sinZ, 0, 0, -sinZ, cz, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
    const scale = new Float32Array([sx, 0, 0, 0, 0, sy, 0, 0, 0, 0, sz, 0, 0, 0, 0, 1]);
    const translation = identity();
    translation[12] = node.position[0];
    translation[13] = node.position[1];
    translation[14] = node.position[2];
    return multiply(translation, multiply(rotationY, multiply(rotationX, multiply(rotationZ, scale))));
  }

  function perspective(fov, aspect, near, far) {
    const f = 1 / Math.tan(fov / 2);
    const range = 1 / (near - far);
    return new Float32Array([
      f / aspect, 0, 0, 0,
      0, f, 0, 0,
      0, 0, (near + far) * range, -1,
      0, 0, 2 * near * far * range, 0,
    ]);
  }

  function uploadGeometry(gl, data) {
    const attributes = {};
    for (const [name, values] of Object.entries({
      aPosition: data.positions,
      aNormal: data.normals,
      aColor: data.colors,
    })) {
      const buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, values, gl.STATIC_DRAW);
      attributes[name] = buffer;
    }

    const edgeVertices = [];
    for (let i = 0; i < data.positions.length; i += 9) {
      const a = data.positions.subarray(i, i + 3);
      const b = data.positions.subarray(i + 3, i + 6);
      const c = data.positions.subarray(i + 6, i + 9);
      edgeVertices.push(...a, ...b, ...b, ...c, ...c, ...a);
    }
    const edges = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, edges);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(edgeVertices), gl.STATIC_DRAW);
    return { attributes, edges, count: data.positions.length / 3, edgeCount: edgeVertices.length / 3 };
  }

  function normalMatrix(matrix) {
    const a = matrix[0], b = matrix[4], c = matrix[8];
    const d = matrix[1], e = matrix[5], f = matrix[9];
    const g = matrix[2], h = matrix[6], i = matrix[10];
    const A = e * i - f * h;
    const B = f * g - d * i;
    const C = d * h - e * g;
    const determinant = a * A + b * B + c * C || 1;
    return new Float32Array([
      A / determinant, (c * h - b * i) / determinant, (b * f - c * e) / determinant,
      B / determinant, (a * i - c * g) / determinant, (c * d - a * f) / determinant,
      C / determinant, (b * g - a * h) / determinant, (a * e - b * d) / determinant,
    ]);
  }

  function create(canvas, root) {
    const gl = canvas.getContext("webgl", { alpha: true, antialias: true, powerPreference: "high-performance" });
    if (!gl) throw new Error("WebGL não está disponível neste navegador.");

    const shaderProgram = program(gl);
    const locations = {
      position: gl.getAttribLocation(shaderProgram, "aPosition"),
      normal: gl.getAttribLocation(shaderProgram, "aNormal"),
      color: gl.getAttribLocation(shaderProgram, "aColor"),
      mvp: gl.getUniformLocation(shaderProgram, "uMvp"),
      model: gl.getUniformLocation(shaderProgram, "uModel"),
      normalMatrix: gl.getUniformLocation(shaderProgram, "uNormalMatrix"),
      baseColor: gl.getUniformLocation(shaderProgram, "uColor"),
      roughness: gl.getUniformLocation(shaderProgram, "uRoughness"),
      wireframe: gl.getUniformLocation(shaderProgram, "uWireframe"),
      camera: gl.getUniformLocation(shaderProgram, "uCamera"),
    };
    const geometryCache = new WeakMap();
    const cameraPosition = [0, 0, 8.6];
    let cameraDistance = 8.6;
    let showWireframe = false;

    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);
    gl.useProgram(shaderProgram);
    gl.uniform3fv(locations.camera, cameraPosition);

    function drawMesh(mesh, world, viewProjection) {
      let buffers = geometryCache.get(mesh.geometry);
      if (!buffers) {
        buffers = uploadGeometry(gl, mesh.geometry);
        geometryCache.set(mesh.geometry, buffers);
      }
      const modelView = multiply(viewProjection.view, world);
      const mvp = multiply(viewProjection.projection, modelView);
      gl.uniformMatrix4fv(locations.model, false, world);
      gl.uniformMatrix4fv(locations.mvp, false, mvp);
      gl.uniformMatrix3fv(locations.normalMatrix, false, normalMatrix(world));
      gl.uniform3fv(locations.baseColor, mesh.color);
      gl.uniform1f(locations.roughness, mesh.roughness);
      gl.uniform1f(locations.wireframe, 0);
      for (const [attribute, buffer] of [
        [locations.position, buffers.attributes.aPosition],
        [locations.normal, buffers.attributes.aNormal],
        [locations.color, buffers.attributes.aColor],
      ]) {
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.enableVertexAttribArray(attribute);
        gl.vertexAttribPointer(attribute, 3, gl.FLOAT, false, 0, 0);
      }
      gl.drawArrays(gl.TRIANGLES, 0, buffers.count);
      if (showWireframe) {
        gl.uniform1f(locations.wireframe, 1);
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.edges);
        gl.vertexAttribPointer(locations.position, 3, gl.FLOAT, false, 0, 0);
        gl.disableVertexAttribArray(locations.normal);
        gl.disableVertexAttribArray(locations.color);
        gl.depthMask(false);
        gl.drawArrays(gl.LINES, 0, buffers.edgeCount);
        gl.depthMask(true);
        gl.enableVertexAttribArray(locations.normal);
        gl.enableVertexAttribArray(locations.color);
      }
    }

    function drawNode(node, parent, viewProjection) {
      const world = multiply(parent, transform(node));
      for (const mesh of node.meshes) drawMesh(mesh, world, viewProjection);
      for (const child of node.children) drawNode(child, world, viewProjection);
    }

    function resize() {
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.max(1, Math.round(canvas.clientWidth * pixelRatio));
      const height = Math.max(1, Math.round(canvas.clientHeight * pixelRatio));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      gl.viewport(0, 0, width, height);
      return width / height;
    }

    function render() {
      const aspect = resize();
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      const projection = perspective(Math.PI / 4.5, aspect, 0.1, 60);
      const view = identity();
      view[14] = -cameraDistance;
      cameraPosition[2] = cameraDistance;
      gl.uniform3fv(locations.camera, cameraPosition);
      drawNode(root, identity(), { projection, view });
    }

    return {
      render,
      setWireframe(enabled) { showWireframe = enabled; },
      setCameraDistance(distance) { cameraDistance = Math.max(5.7, Math.min(12, distance)); },
      get context() { return gl; },
    };
  }

  window.LoboPirata.renderer = { create };
  window.LoboPirata.colors = {
    foxOrange: [0.94, 0.33, 0.05],
    foxAmber: [0.98, 0.55, 0.12],
    foxDark: [0.28, 0.08, 0.06],
    foxBurgundy: [0.48, 0.1, 0.08],
    rust: [0.82, 0.22, 0.06],
    orange: [0.94, 0.35, 0.06],
    amber: [0.98, 0.58, 0.14],
    cream: [0.92, 0.82, 0.72],
    white: [0.96, 0.94, 0.9],
    darkFur: [0.12, 0.08, 0.08],
    innerEar: [0.24, 0.16, 0.16],
    innerEarHighlight: [0.85, 0.8, 0.76],
    leather: [0.15, 0.14, 0.14],
    hatGold: [0.96, 0.68, 0.16],
    gold: [0.96, 0.72, 0.18],
    skullYellow: [0.96, 0.92, 0.65],
    eyepatchFacet: [0.32, 0.3, 0.28],
    redBandana: [0.78, 0.14, 0.09],
    darkRed: [0.42, 0.06, 0.05],
    eyeGlow: [1.0, 0.58, 0.04],
    black: [0.03, 0.03, 0.04],
    bone: [0.94, 0.88, 0.75],
  };
})();
