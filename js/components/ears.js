(() => {
  "use strict";

  const { node, geometry, colors } = window.LoboPirata;

  window.LoboPirata.parts.ears = (root) => {
    const pair = root.add(node("ears"));
    for (const side of [-1, 1]) {
      const earGroup = pair.add(node(side < 0 ? "left-ear-group" : "right-ear-group", [side * 0.72, 0.95, -0.05]));
      earGroup.rotation[2] = -side * 0.22;

      // Main tall outer ear cone
      const outer = earGroup.add(node("outer-ear", [0, 0.65, 0]));
      outer.scale = [0.42, 1.45, 0.25];
      outer.mesh(geometry.cone(6, 0.02, 0.85), colors.foxOrange, 0.82);

      // Outer rim facet
      const outerRim = earGroup.add(node("outer-rim", [side * 0.15, 0.65, -0.02]));
      outerRim.scale = [0.28, 1.38, 0.2];
      outerRim.mesh(geometry.cone(5, 0.01, 0.8), colors.foxAmber, 0.8);

      // Inner ear dark cavity
      const innerDark = earGroup.add(node("inner-dark", [0, 0.58, 0.08]));
      innerDark.scale = [0.28, 1.15, 0.12];
      innerDark.mesh(geometry.cone(5, 0.01, 0.75), colors.darkFur, 0.92);

      // Inner ear cream highlight facet
      const innerCream = earGroup.add(node("inner-cream", [-side * 0.04, 0.52, 0.12]));
      innerCream.scale = [0.18, 0.85, 0.08];
      innerCream.mesh(geometry.cone(4, 0.01, 0.7), colors.cream, 0.85);

      // Earring group
      const earringGroup = earGroup.add(node(side < 0 ? "left-earring" : "right-earring", [-side * 0.22, 0.28, 0.12]));
      earringGroup.rotation[0] = 0.2;
      earringGroup.rotation[1] = side * 0.3;
      earringGroup.rotation[2] = -side * 0.2;

      for (const [offsetY, offsetZ, ringScale] of [[0, 0, 0.15], [-0.14, 0.02, 0.13]]) {
        const ring = earringGroup.add(node("hoop-ring", [0, offsetY, offsetZ]));
        ring.mesh(geometry.torus(ringScale, 0.03, 12, 6), colors.gold, 0.22);
      }
    }
    return pair;
  };
})();
