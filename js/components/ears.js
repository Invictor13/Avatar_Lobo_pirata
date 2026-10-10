(() => {
  "use strict";

  const { node, geometry } = window.LoboPirata;

  const earOuter = [0xc83a10, 0xdb4a15, 0xef5819, 0xff8a22, 0xd33b12, 0x74301f];
  const earInnerDark = [0x141018, 0x24161a, 0x3a1f1b, 0x101118, 0x48241c];
  const innerHighlights = [0xdca68a, 0xebd0c2, 0x9e624c, 0xf2dfd3];
  const whiteFurPalette = [0xffffff, 0xffffff, 0xf5f5f5, 0xebebeb];
  const goldColor = 0xffcf69;

  window.LoboPirata.parts.ears = (root) => {
    const earsGroup = root.add(node("wolf-ears"));

    for (const s of [-1, 1]) {
      const x = (v) => s * v;
      const earNode = earsGroup.add(node(s === -1 ? "left-ear" : "right-ear"));

      // 1. Back shell structure (Curved 3D back cartilage wall)
      const outerPoly = [
        [x(0.32), 0.58], [x(0.40), 1.28], [x(0.70), 2.38], [x(0.92), 2.54],
        [x(1.16), 2.33], [x(1.18), 1.88], [x(1.10), 1.25], [x(0.90), 0.66], [x(0.60), 0.50]
      ];
      // Extrude deeper Z wall thickness for realistic thick ear cartilage
      earNode.mesh(geometry.extrudedPolygon(outerPoly, -0.05, 0.42, earOuter), [1, 1, 1], 0.82);

      // 2. Concave Inner Concha (Deep recessed cavity inside ear)
      const innerPoly = [
        [x(0.52), 0.86], [x(0.54), 1.42], [x(0.76), 2.18], [x(0.90), 2.30],
        [x(1.03), 2.11], [x(1.02), 1.68], [x(0.91), 1.20], [x(0.76), 0.86]
      ];
      earNode.mesh(geometry.extrudedPolygon(innerPoly, 0.18, 0.12, earInnerDark), [1, 1, 1], 0.88);

      // 3. Faceted inner ear cartilage ridges & depth highlights
      const innerTris = [
        [[x(0.56), 1.02, 0.22], [x(0.63), 1.47, 0.22], [x(0.85), 2.14, 0.22]],
        [[x(0.63), 1.47, 0.22], [x(0.96), 1.69, 0.22], [x(0.85), 2.14, 0.22]],
        [[x(0.56), 1.02, 0.22], [x(0.75), 0.94, 0.22], [x(0.63), 1.47, 0.22]],
        [[x(0.63), 1.47, 0.22], [x(0.96), 1.69, 0.22], [x(0.80), 1.32, 0.22]]
      ];
      earNode.mesh(geometry.surfaceTriangles(innerTris, innerHighlights), [1, 1, 1], 0.82);

      // 4. Volumetric White Ear Tufts (dense inner ear white fur sticking out naturally)
      const tuftPoly1 = [
        [x(0.48), 0.72], [x(0.60), 1.22], [x(0.75), 0.80]
      ];
      earNode.mesh(geometry.extrudedPolygon(tuftPoly1, 0.24, 0.14, whiteFurPalette), [1, 1, 1], 0.75);

      const tuftPoly2 = [
        [x(0.58), 1.05], [x(0.78), 1.65], [x(0.88), 1.15]
      ];
      earNode.mesh(geometry.extrudedPolygon(tuftPoly2, 0.22, 0.12, whiteFurPalette), [1, 1, 1], 0.75);

      // 5. Gold ear trim along upper outer edge
      const trimPts = [
        [x(0.40), 1.28, 0.22], [x(0.70), 2.38, 0.22], [x(0.92), 2.54, 0.22],
        [x(1.16), 2.33, 0.22], [x(1.18), 1.88, 0.22]
      ];
      earNode.mesh(geometry.tube(trimPts, 0.016, 6), goldColor, 0.3);

      // 6. Gold earring hanging from ear lobe
      const earring = earNode.add(node("gold-earring", [s * 1.08, 0.02, 0.49]));
      earring.mesh(geometry.torus(0.155, 0.027, 9, 6), goldColor, 0.28);
      earring.mesh(geometry.ellipsoid(0, 0.17, 0, 0.045, 0.06, 0.055, 7, 4, [0xffd36a, 0xd4912c]), goldColor, 0.28);
      earring.mesh(geometry.ellipsoid(0, -0.155, 0, 0.04, 0.045, 0.045, 7, 4, [0xd4912c, 0xffc34f]), goldColor, 0.28);
    }

    return earsGroup;
  };
})();
