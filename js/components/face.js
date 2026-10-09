(() => {
  "use strict";

  const { node, geometry } = window.LoboPirata;

  const furOrange = [0xd84312, 0xef5617, 0xff741c, 0xc93412, 0xf68b2b, 0x9e2b15, 0xff9a38];
  const furLight = [0xe5b68a, 0xf0c8a2, 0xb77e61, 0xffd8b6, 0x98664f];

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

      // Fur flanges
      const flangePoly1 = [
        [x(0.57), 0.55], [x(0.92), 0.43], [x(1.26), 0.14], [x(1.05), 0.08],
        [x(1.22), -0.13], [x(0.94), -0.10], [x(1.08), -0.38], [x(0.80), -0.30],
        [x(0.61), -0.47], [x(0.48), -0.05]
      ];
      face.mesh(geometry.extrudedPolygon(flangePoly1, 0.34, 0.22, furOrange), [1, 1, 1], 0.82);

      const flangePoly2 = [
        [x(0.62), 0.05], [x(0.92), -0.04], [x(1.17), -0.35], [x(0.91), -0.29],
        [x(0.99), -0.56], [x(0.70), -0.48], [x(0.48), -0.27]
      ];
      face.mesh(geometry.extrudedPolygon(flangePoly2, 0.50, 0.15, [0xa82c14, 0xd23c13, 0xf66b1b, 0xffa13d]), [1, 1, 1], 0.82);

      // Light cheek facet
      const cheekPoly = [
        [x(0.31), -0.32], [x(0.58), -0.19], [x(0.83), -0.28], [x(0.94), -0.49],
        [x(0.70), -0.47], [x(0.62), -0.72], [x(0.42), -0.58], [x(0.26), -0.67]
      ];
      face.mesh(geometry.extrudedPolygon(cheekPoly, 0.56, 0.12, furLight), [1, 1, 1], 0.72);

      // Surface cheek triangles
      const cheekTris = [
        [[x(0.34), -0.28, 0.635], [x(0.56), -0.18, 0.635], [x(0.76), -0.31, 0.635]],
        [[x(0.56), -0.18, 0.635], [x(0.84), -0.31, 0.615], [x(0.76), -0.31, 0.635]],
        [[x(0.76), -0.31, 0.635], [x(0.92), -0.48, 0.60], [x(0.68), -0.46, 0.635]],
        [[x(0.34), -0.28, 0.635], [x(0.47), -0.53, 0.635], [x(0.30), -0.58, 0.60]]
      ];
      face.mesh(geometry.surfaceTriangles(cheekTris, [0xefd0ac, 0xc69a7b, 0xffddba, 0x9c6a52]), [1, 1, 1], 0.76);
    }

    return face;
  };
})();
