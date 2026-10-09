(() => {
  "use strict";

  const { node, geometry } = window.LoboPirata;

  const furOrange = [0xd84312, 0xef5617, 0xff741c, 0xc93412, 0xf68b2b, 0x9e2b15, 0xff9a38];
  // Pure white/cream palette for light white fur tufts on both left and right sides
  const whiteFurPalette = [0xffffff, 0xffffff, 0xfafafa, 0xffffff, 0xf5f5f5];

  function makeCCW(pts) {
    let area = 0;
    for (let i = 0; i < pts.length; i++) {
      const p = pts[i];
      const q = pts[(i + 1) % pts.length];
      area += p[0] * q[1] - q[0] * p[1];
    }
    return area < 0 ? pts.slice().reverse() : pts;
  }

  function fixTriCCW(tri) {
    const [a, b, c] = tri;
    const nz = (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
    return nz < 0 ? [a, c, b] : [a, b, c];
  }

  window.LoboPirata.parts.face = (root) => {
    const face = root.add(node("wolf-face"));

    // Main cranium
    const craniumGeom = geometry.ellipsoid(
      0, 0.30, -0.015, 1.00, 0.88, 0.47, 11, 7, furOrange,
      (p, n) => [p[0] * (1 + 0.06 * Math.max(0, -n[1])), p[1], p[2] + 0.05 * Math.abs(n[0])]
    );
    face.mesh(craniumGeom, [1, 1, 1], 0.82);

    // Cheek flanges and facet details for both sides
    for (const s of [-1, 1]) {
      const x = (v) => s * v;

      // Outer orange fur flange
      const flangePoly1 = makeCCW([
        [x(0.57), 0.55], [x(0.92), 0.43], [x(1.26), 0.14], [x(1.05), 0.08],
        [x(1.22), -0.13], [x(0.94), -0.10], [x(1.08), -0.38], [x(0.80), -0.30],
        [x(0.61), -0.47], [x(0.48), -0.05]
      ]);
      face.mesh(geometry.extrudedPolygon(flangePoly1, 0.34, 0.22, furOrange), [1, 1, 1], 0.82);

      // Light white cheek tuft symmetrically on BOTH sides (s = -1 and s = 1)
      const cheekPoly = makeCCW([
        [x(0.31), -0.32], [x(0.58), -0.19], [x(0.83), -0.28], [x(0.94), -0.49],
        [x(0.70), -0.47], [x(0.62), -0.72], [x(0.42), -0.58], [x(0.26), -0.67]
      ]);
      face.mesh(geometry.extrudedPolygon(cheekPoly, 0.58, 0.18, whiteFurPalette), [1, 1, 1], 0.72);

      // Surface white cheek triangles for high contrast white fur symmetrically on both cheeks
      const cheekTris = [
        [[x(0.34), -0.28, 0.65], [x(0.56), -0.18, 0.65], [x(0.76), -0.31, 0.65]],
        [[x(0.56), -0.18, 0.65], [x(0.84), -0.31, 0.63], [x(0.76), -0.31, 0.65]],
        [[x(0.76), -0.31, 0.65], [x(0.92), -0.48, 0.62], [x(0.68), -0.46, 0.65]],
        [[x(0.34), -0.28, 0.65], [x(0.47), -0.53, 0.65], [x(0.30), -0.58, 0.62]]
      ].map(fixTriCCW);
      face.mesh(geometry.surfaceTriangles(cheekTris, whiteFurPalette), [1, 1, 1], 0.72);
    }

    return face;
  };
})();
