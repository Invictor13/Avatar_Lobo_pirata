(() => {
  "use strict";

  const api = window.LoboPirata = { parts: {}, math: {} };

  const cross = (a, b) => [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];
  const normalize = (v) => {
    const length = Math.hypot(v[0], v[1], v[2]) || 1;
    return [v[0] / length, v[1] / length, v[2] / length];
  };

  function triangles(faces) {
    const positions = [];
    const normals = [];
    const colors = [];
    let seed = 17;
    for (const face of faces) {
      const [a, b, c, tint = 1] = face;
      const normal = normalize(cross(
        [b[0] - a[0], b[1] - a[1], b[2] - a[2]],
        [c[0] - a[0], c[1] - a[1], c[2] - a[2]],
      ));
      seed = (seed * 16807) % 2147483647;
      const variation = 0.91 + (seed / 2147483647) * 0.18;
      for (const vertex of [a, b, c]) {
        positions.push(...vertex);
        normals.push(...normal);
        colors.push(variation * tint, variation * tint, variation * tint);
      }
    }
    return {
      positions: new Float32Array(positions),
      normals: new Float32Array(normals),
      colors: new Float32Array(colors),
    };
  }

  function sphereGeometry(widthSegments = 20, heightSegments = 14) {
    const faces = [];
    for (let y = 0; y < heightSegments; y++) {
      const v0 = y / heightSegments;
      const v1 = (y + 1) / heightSegments;
      for (let x = 0; x < widthSegments; x++) {
        const u0 = x / widthSegments;
        const u1 = (x + 1) / widthSegments;
        const point = (u, v) => {
          const theta = u * Math.PI * 2;
          const phi = v * Math.PI;
          return [
            -Math.cos(theta) * Math.sin(phi),
            Math.cos(phi),
            Math.sin(theta) * Math.sin(phi),
          ];
        };
        const a = point(u0, v0);
        const b = point(u0, v1);
        const c = point(u1, v1);
        const d = point(u1, v0);
        if (y !== 0) faces.push([a, b, d]);
        if (y !== heightSegments - 1) faces.push([b, c, d]);
      }
    }
    return triangles(faces);
  }

  function loftGeometry(profile, radialSegments = 24, lengthSegments = 36) {
    const faces = [];
    const point = (u, v) => {
      const profilePosition = u * (profile.length - 1);
      const index = Math.min(profile.length - 2, Math.floor(profilePosition));
      const start = profile[index];
      const end = profile[index + 1];
      const raw = profilePosition - index;
      const t = raw * raw * (3 - 2 * raw);
      const z = start[0] + (end[0] - start[0]) * t;
      const centerY = start[1] + (end[1] - start[1]) * t;
      const radiusX = start[2] + (end[2] - start[2]) * t;
      const radiusY = start[3] + (end[3] - start[3]) * t;
      const angle = (v / radialSegments) * Math.PI * 2;
      return [Math.cos(angle) * radiusX, centerY + Math.sin(angle) * radiusY, z];
    };

    for (let i = 0; i < lengthSegments; i++) {
      for (let j = 0; j < radialSegments; j++) {
        const a = point(i / lengthSegments, j);
        const b = point((i + 1) / lengthSegments, j);
        const c = point((i + 1) / lengthSegments, j + 1);
        const d = point(i / lengthSegments, j + 1);
        faces.push([a, d, b], [d, c, b]);
      }
    }

    const back = [0, profile[0][1], profile[0][0]];
    const tip = [0, profile.at(-1)[1], profile.at(-1)[0]];
    for (let j = 0; j < radialSegments; j++) {
      faces.push([back, point(0, j + 1), point(0, j)]);
      faces.push([tip, point(1, j), point(1, j + 1)]);
    }
    return triangles(faces);
  }

  function wolfHeadGeometry() {
    const faces = [];
    const widthSegments = 40;
    const profile = [
      [1.12, 0.012, 0.13, 0.13],
      [0.98, 0.24, 0.34, 0.31],
      [0.76, 0.51, 0.51, 0.4],
      [0.49, 0.65, 0.63, 0.47],
      [0.21, 0.75, 0.68, 0.5],
      [-0.08, 0.79, 0.63, 0.51],
      [-0.34, 0.79, 0.59, 0.46],
      [-0.49, 0.73, 0.54, 0.43],
      [-0.61, 0.62, 0.48, 0.39],
      [-0.78, 0.44, 0.4, 0.31],
      [-0.96, 0.24, 0.27, 0.22],
      [-1.06, 0.012, 0.16, 0.15],
    ];
    const heightSegments = (profile.length - 1) * 4;
    const point = (u, v) => {
      const position = u * (profile.length - 1);
      const index = Math.min(profile.length - 2, Math.floor(position));
      const t = position - index;
      const smooth = t * t * (3 - 2 * t);
      const start = profile[index];
      const end = profile[index + 1];
      const [y, halfWidth, frontDepth, backDepth] = start.map(
        (value, component) => value + (end[component] - value) * smooth,
      );
      const angle = v * Math.PI * 2;
      const cosine = Math.cos(angle);
      const sine = Math.sin(angle);
      const depth = sine >= 0 ? frontDepth : backDepth;
      const cheekbone = Math.max(0, 1 - Math.abs(y + 0.3) * 4.2) * Math.abs(cosine) * 0.075;
      const jawPlane = Math.max(0, 1 - Math.abs(y + 0.65) * 3.8) * Math.abs(cosine) * 0.035;
      return [
        cosine * (halfWidth + cheekbone - jawPlane),
        y,
        sine * depth,
      ];
    };

    for (let y = 0; y < heightSegments; y++) {
      for (let x = 0; x < widthSegments; x++) {
        const u0 = y / heightSegments;
        const u1 = (y + 1) / heightSegments;
        const v0 = x / widthSegments;
        const v1 = (x + 1) / widthSegments;
        const a = point(u0, v0);
        const b = point(u0, v1);
        const c = point(u1, v1);
        const d = point(u1, v0);
        const tint = 0.92 + ((x + y * 7) % 9) * 0.012;
        faces.push([a, b, d, tint], [d, b, c, tint]);
      }
    }
    return triangles(faces);
  }

  function coneGeometry(segments = 9, topRadius = 0, bottomRadius = 1) {
    const faces = [];
    const low = [];
    const high = [];
    for (let i = 0; i < segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      low.push([Math.cos(angle) * bottomRadius, -0.5, Math.sin(angle) * bottomRadius]);
      high.push([Math.cos(angle) * topRadius, 0.5, Math.sin(angle) * topRadius]);
    }
    const bottom = [0, -0.5, 0];
    const top = [0, 0.5, 0];
    for (let i = 0; i < segments; i++) {
      const next = (i + 1) % segments;
      faces.push([low[i], high[i], low[next]]);
      faces.push([low[next], high[i], high[next]]);
      if (bottomRadius > 0) faces.push([bottom, low[next], low[i]]);
      if (topRadius > 0) faces.push([top, high[i], high[next]]);
    }
    return triangles(faces);
  }

  function cylinderGeometry(segments = 12, topRadius = 1, bottomRadius = 1) {
    return coneGeometry(segments, topRadius, bottomRadius);
  }

  function torusGeometry(radius = 0.5, tubeRadius = 0.08, segments = 16, sides = 6) {
    const faces = [];
    const point = (u, v) => {
      const a = (u / segments) * Math.PI * 2;
      const b = (v / sides) * Math.PI * 2;
      const r = radius + tubeRadius * Math.cos(b);
      return [r * Math.cos(a), r * Math.sin(a), tubeRadius * Math.sin(b)];
    };
    for (let i = 0; i < segments; i++) {
      for (let j = 0; j < sides; j++) {
        const a = point(i, j);
        const b = point(i + 1, j);
        const c = point(i + 1, j + 1);
        const d = point(i, j + 1);
        faces.push([a, b, d], [b, c, d]);
      }
    }
    return triangles(faces);
  }

  function tubeGeometry(points, radius = 0.035, sides = 6) {
    const faces = [];
    const rings = points.map((point, index) => {
      const previous = points[Math.max(0, index - 1)];
      const next = points[Math.min(points.length - 1, index + 1)];
      const tangent = normalize([
        next[0] - previous[0],
        next[1] - previous[1],
        next[2] - previous[2],
      ]);
      const reference = Math.abs(tangent[1]) > 0.92 ? [1, 0, 0] : [0, 1, 0];
      const normal = normalize(cross(tangent, reference));
      const binormal = normalize(cross(tangent, normal));
      return Array.from({ length: sides }, (_, side) => {
        const angle = (side / sides) * Math.PI * 2;
        return [
          point[0] + radius * (normal[0] * Math.cos(angle) + binormal[0] * Math.sin(angle)),
          point[1] + radius * (normal[1] * Math.cos(angle) + binormal[1] * Math.sin(angle)),
          point[2] + radius * (normal[2] * Math.cos(angle) + binormal[2] * Math.sin(angle)),
        ];
      });
    });
    for (let i = 0; i < rings.length - 1; i++) {
      for (let j = 0; j < sides; j++) {
        const next = (j + 1) % sides;
        faces.push(
          [rings[i][j], rings[i + 1][j], rings[i][next]],
          [rings[i + 1][j], rings[i + 1][next], rings[i][next]],
        );
      }
    }
    return triangles(faces);
  }

  const node = (name, position = [0, 0, 0]) => ({
    name,
    position: [...position],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
    children: [],
    meshes: [],
    add(child) { this.children.push(child); return child; },
    mesh(geometry, color, roughness = 0.76) {
      this.meshes.push({ geometry, color, roughness });
      return this;
    },
  });

  api.geometry = {
    sphere: sphereGeometry,
    wolfHead: wolfHeadGeometry,
    loft: loftGeometry,
    cone: coneGeometry,
    cylinder: cylinderGeometry,
    torus: torusGeometry,
    tube: tubeGeometry,
    triangles,
  };
  api.node = node;
  api.math.cross = cross;
  api.math.normalize = normalize;
})();
