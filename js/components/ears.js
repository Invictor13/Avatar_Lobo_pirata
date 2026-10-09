(() => {
  "use strict";

  const { node, geometry, colors } = window.LoboPirata;

  window.LoboPirata.parts.ears = (root) => {
    const pair = root.add(node("ears"));
    for (const side of [-1, 1]) {
      // Outer faceted ear cone
      const outer = pair.add(node(side < 0 ? "left-ear" : "right-ear", [side * 0.88, 1.35, -0.05]));
      outer.rotation[2] = -side * 0.16;
      outer.scale = [0.48, 1.45, 0.28];
      outer.mesh(geometry.cone(7, 0.02, 0.85), colors.foxOrange, 0.82);

      // Ear back/rim facet
      const earBack = pair.add(node("ear-back", [side * 0.92, 1.38, -0.12]));
      earBack.rotation[2] = -side * 0.16;
      earBack.scale = [0.42, 1.38, 0.22];
      earBack.mesh(geometry.cone(6, 0.01, 0.8), colors.foxAmber, 0.85);

      // Inner ear dark pocket
      const inner = pair.add(node("inner-ear", [side * 0.88, 1.32, 0.15]));
      inner.rotation[2] = -side * 0.16;
      inner.scale = [0.32, 1.05, 0.14];
      inner.mesh(geometry.cone(6, 0.015, 0.75), colors.innerEar, 0.92);

      // Inner ear cream/white inner facet
      const innerLight = pair.add(node("inner-ear-highlight", [side * 0.86, 1.3, 0.22]));
      innerLight.rotation[2] = -side * 0.16;
      innerLight.scale = [0.2, 0.72, 0.08];
      innerLight.mesh(geometry.cone(5, 0.01, 0.7), colors.cream, 0.88);

      // Outer ear rim orange highlight
      const earOuterRim = pair.add(node("ear-outer-rim", [side * 1.08, 1.42, 0.02]));
      earOuterRim.rotation[2] = -side * 0.22;
      earOuterRim.scale = [0.18, 1.2, 0.12];
      earOuterRim.mesh(geometry.cone(5, 0.01, 0.7), colors.foxAmber, 0.8);

      // Gold hoop earring on both ears
      const earringGroup = pair.add(node(side < 0 ? "left-earring" : "right-earring", [side * 1.15, 0.72, 0.35]));
      earringGroup.rotation[0] = 0.2;
      earringGroup.rotation[1] = side * 0.3;
      earringGroup.rotation[2] = -side * 0.2;

      // Double hoop earrings as in logo image
      for (const [offsetY, offsetZ, ringScale] of [[0, 0, 0.16], [-0.12, 0.04, 0.14]]) {
        const ring = earringGroup.add(node("hoop-ring", [0, offsetY, offsetZ]));
        ring.mesh(geometry.torus(ringScale, 0.035, 12, 6), colors.gold, 0.22);
      }
    }
    return pair;
  };
})();
