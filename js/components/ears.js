(() => {
  "use strict";

  const { node, geometry } = window.LoboPirata;

  const earOuter = [0x96280f, 0xb93212, 0xef5819, 0xff8a22, 0xd33b12, 0x74301f];
  const earInner = [0x1b1720, 0x3c2022, 0x62291f, 0x171820, 0x8b4934];
  const innerHighlights = [0xb78266, 0xd4a087, 0x7a4938, 0xe2b49a];
  const goldColor = 0xffcf69;

  window.LoboPirata.parts.ears = (root) => {
    const earsGroup = root.add(node("wolf-ears"));

    for (const s of [-1, 1]) {
      const x = (v) => s * v;
      const earNode = earsGroup.add(node(s === -1 ? "left-ear" : "right-ear"));

      // Outer ear shell
      const outerPoly = [
        [x(0.34), 0.60], [x(0.42), 1.26], [x(0.72), 2.36], [x(0.93), 2.52],
        [x(1.15), 2.31], [x(1.16), 1.86], [x(1.08), 1.25], [x(0.89), 0.66], [x(0.60), 0.51]
      ];
      earNode.mesh(geometry.extrudedPolygon(outerPoly, 0.02, 0.36, earOuter), [1, 1, 1], 0.8);

      // Inner ear concha
      const innerPoly = [
        [x(0.55), 0.88], [x(0.56), 1.42], [x(0.79), 2.19], [x(0.91), 2.30],
        [x(1.03), 2.11], [x(1.02), 1.68], [x(0.91), 1.20], [x(0.76), 0.86]
      ];
      earNode.mesh(geometry.extrudedPolygon(innerPoly, 0.235, 0.035, earInner), [1, 1, 1], 0.82);

      // Faceted inner ear highlights
      const innerTris = [
        [[x(0.58), 1.04, 0.265], [x(0.65), 1.47, 0.265], [x(0.86), 2.14, 0.265]],
        [[x(0.65), 1.47, 0.265], [x(0.97), 1.69, 0.265], [x(0.86), 2.14, 0.265]],
        [[x(0.58), 1.04, 0.265], [x(0.76), 0.94, 0.265], [x(0.65), 1.47, 0.265]],
        [[x(0.65), 1.47, 0.265], [x(0.97), 1.69, 0.265], [x(0.81), 1.32, 0.265]]
      ];
      earNode.mesh(geometry.surfaceTriangles(innerTris, innerHighlights), [1, 1, 1], 0.78);

      // Gold ear trim along upper outer edge
      const trimPts = [
        [x(0.42), 1.26, 0.215], [x(0.72), 2.36, 0.215], [x(0.93), 2.52, 0.215],
        [x(1.15), 2.31, 0.215], [x(1.16), 1.86, 0.215]
      ];
      earNode.mesh(geometry.tube(trimPts, 0.012, 6), goldColor, 0.3);

      // Gold earring
      const earring = earNode.add(node("gold-earring", [s * 1.075, 0.02, 0.49]));
      earring.mesh(geometry.torus(0.155, 0.027, 9, 6), goldColor, 0.28);
      earring.mesh(geometry.ellipsoid(0, 0.17, 0, 0.045, 0.06, 0.055, 7, 4, [0xffd36a, 0xd4912c]), goldColor, 0.28);
      earring.mesh(geometry.ellipsoid(0, -0.155, 0, 0.04, 0.045, 0.045, 7, 4, [0xd4912c, 0xffc34f]), goldColor, 0.28);
    }

    return earsGroup;
  };
})();
