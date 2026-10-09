(() => {
  "use strict";

  const { node, geometry, colors } = window.LoboPirata;
  const sphere = (w = 8, h = 6) => geometry.sphere(w, h);

  window.LoboPirata.parts.accessories = (root) => {
    const gear = root.add(node("pirate-accessories"));

    // Eyepatch on left side of fox's face (which is on observer's left when facing front, side = -1)
    const patchGroup = gear.add(node("eyepatch-group", [-0.38, 0.28, 0.76]));
    patchGroup.rotation[2] = -0.18;

    // Eyepatch strap running across forehead/face
    const strap = gear.add(node("eyepatch-strap"));
    strap.mesh(geometry.tube([
      [-0.88, 0.52, 0.22], [-0.65, 0.42, 0.5], [-0.38, 0.28, 0.76],
      [0.02, 0.12, 0.82], [0.42, -0.05, 0.78], [0.78, -0.25, 0.52],
    ], 0.048, 6), colors.leather, 0.85);

    // Eyepatch gold outer rim frame
    const patchRim = patchGroup.add(node("patch-gold-rim", [0, 0, 0]));
    patchRim.scale = [0.34, 0.28, 0.08];
    patchRim.mesh(sphere(8, 6), colors.gold, 0.28);

    // Eyepatch dark faceted main shield
    const patchMain = patchGroup.add(node("patch-faceted-surface", [0, 0, 0.04]));
    patchMain.scale = [0.3, 0.24, 0.12];
    patchMain.mesh(sphere(6, 5), colors.eyepatchFacet, 0.6);

    // Eyepatch inner raised gem/plate facet
    const patchPlate = patchGroup.add(node("patch-center-gem", [0, 0, 0.1]));
    patchPlate.scale = [0.2, 0.15, 0.05];
    patchPlate.mesh(sphere(5, 4), colors.foxDark, 0.7);

    // Red bandana scarf around neck with knot and trailing ends on right side
    const bandanaGroup = gear.add(node("red-bandana-scarf", [0, -0.88, 0.45]));

    // Bandana collar wrap around lower neck/jaw
    const bandanaWrap = bandanaGroup.add(node("bandana-collar", [0, 0, 0]));
    bandanaWrap.scale = [0.78, 0.25, 0.55];
    bandanaWrap.mesh(sphere(10, 6), colors.redBandana, 0.8);

    // Bandana front fold facets
    const bandanaFoldLeft = bandanaGroup.add(node("bandana-fold-left", [-0.25, -0.08, 0.28]));
    bandanaFoldLeft.rotation[2] = 0.35;
    bandanaFoldLeft.scale = [0.32, 0.22, 0.18];
    bandanaFoldLeft.mesh(geometry.cone(5, 0.02, 0.7), colors.redBandana, 0.82);

    const bandanaFoldRight = bandanaGroup.add(node("bandana-fold-right", [0.25, -0.08, 0.28]));
    bandanaFoldRight.rotation[2] = -0.35;
    bandanaFoldRight.scale = [0.32, 0.22, 0.18];
    bandanaFoldRight.mesh(geometry.cone(5, 0.02, 0.7), colors.redBandana, 0.82);

    const bandanaCenterTriangle = bandanaGroup.add(node("bandana-center-tip", [0, -0.22, 0.32]));
    bandanaCenterTriangle.scale = [0.38, 0.35, 0.12];
    bandanaCenterTriangle.mesh(geometry.cone(5, 0.01, 0.8), colors.darkRed, 0.85);

    // Bandana tied knot on right side (observer's right, side = 1)
    const bandanaKnot = bandanaGroup.add(node("bandana-knot", [0.62, -0.08, 0.22]));
    bandanaKnot.scale = [0.15, 0.14, 0.12];
    bandanaKnot.mesh(sphere(6, 5), colors.darkRed, 0.85);

    // Bandana trailing ends pointing down-right
    for (const [index, angle, sz] of [[0, -0.5, 0.38], [1, -0.8, 0.32]]) {
      const tail = bandanaKnot.add(node(`bandana-tail-${index}`, [0.08 + index * 0.08, -0.15 - index * 0.1, 0]));
      tail.rotation[2] = angle;
      tail.scale = [0.12, sz, 0.08];
      tail.mesh(geometry.cone(4, 0.01, 0.7), colors.redBandana, 0.82);
    }

    // Background floating orbital rings (as seen in logo.jpg)
    const ringGroup = gear.add(node("background-orbital-rings", [0, 0.2, -0.5]));
    for (const [radius, tiltX, tiltY, sideAngle] of [
      [2.8, 0.2, 0.3, 0.1],
      [3.2, -0.3, -0.2, -0.15],
      [3.8, 0.1, -0.4, 0.2],
    ]) {
      const ring = ringGroup.add(node("orbital-ring"));
      ring.rotation[0] = tiltX;
      ring.rotation[1] = tiltY;
      ring.rotation[2] = sideAngle;
      ring.mesh(geometry.torus(radius, 0.015, 32, 6), [0.85, 0.48, 0.12], 0.1);
    }

    // Floating gold coins surrounding the pirate fox (as in logo.jpg)
    const coinPositions = [
      [2.2, 2.6, -0.2],
      [-2.4, -1.2, -0.1],
      [2.5, -1.8, -0.3],
      [-1.8, -2.8, -0.4],
      [1.9, -3.1, -0.2],
    ];

    for (const [index, pos] of coinPositions.entries()) {
      const coin = gear.add(node("floating-coin", pos));
      coin.rotation[0] = 0.4 + index * 0.3;
      coin.rotation[1] = 0.5 * index;
      coin.scale = [0.22, 0.22, 0.04];
      coin.mesh(geometry.cylinder(12, 0.2, 0.2), colors.gold, 0.25);
    }

    return gear;
  };
})();
