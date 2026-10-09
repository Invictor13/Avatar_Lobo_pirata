(() => {
  "use strict";

  const { node, geometry, colors } = window.LoboPirata;
  const sphere = (w = 8, h = 6) => geometry.sphere(w, h);

  window.LoboPirata.parts.accessories = (root) => {
    const gear = root.add(node("pirate-accessories"));

    // Eyepatch on left side of face
    const patchGroup = gear.add(node("eyepatch-group", [-0.32, 0.22, 0.62]));
    patchGroup.rotation[2] = -0.18;

    // Eyepatch strap
    const strap = gear.add(node("eyepatch-strap"));
    strap.mesh(geometry.tube([
      [-0.78, 0.45, 0.18], [-0.55, 0.35, 0.42], [-0.32, 0.22, 0.62],
      [0.02, 0.08, 0.68], [0.38, -0.08, 0.62], [0.68, -0.22, 0.42],
    ], 0.042, 6), colors.leather, 0.85);

    // Eyepatch gold outer rim frame
    const patchRim = patchGroup.add(node("patch-gold-rim", [0, 0, 0]));
    patchRim.scale = [0.3, 0.25, 0.07];
    patchRim.mesh(sphere(8, 6), colors.gold, 0.28);

    // Eyepatch dark faceted main shield
    const patchMain = patchGroup.add(node("patch-faceted-surface", [0, 0, 0.04]));
    patchMain.scale = [0.26, 0.21, 0.1];
    patchMain.mesh(sphere(6, 5), colors.eyepatchFacet, 0.6);

    // Eyepatch inner raised gem/plate facet
    const patchPlate = patchGroup.add(node("patch-center-gem", [0, 0, 0.09]));
    patchPlate.scale = [0.18, 0.13, 0.04];
    patchPlate.mesh(sphere(5, 4), colors.foxDark, 0.7);

    // Red bandana scarf around neck
    const bandanaGroup = gear.add(node("red-bandana-scarf", [0, -0.78, 0.22]));

    // Bandana collar wrap fitting snugly around base of neck
    const bandanaWrap = bandanaGroup.add(node("bandana-collar", [0, 0, 0]));
    bandanaWrap.scale = [0.42, 0.10, 0.30];
    bandanaWrap.mesh(sphere(10, 6), colors.redBandana, 0.8);

    // Bandana front fold facets
    const bandanaFoldLeft = bandanaGroup.add(node("bandana-fold-left", [-0.12, -0.05, 0.12]));
    bandanaFoldLeft.rotation[2] = 0.35;
    bandanaFoldLeft.scale = [0.15, 0.12, 0.08];
    bandanaFoldLeft.mesh(geometry.cone(5, 0.02, 0.7), colors.redBandana, 0.82);

    const bandanaFoldRight = bandanaGroup.add(node("bandana-fold-right", [0.12, -0.05, 0.12]));
    bandanaFoldRight.rotation[2] = -0.35;
    bandanaFoldRight.scale = [0.15, 0.12, 0.08];
    bandanaFoldRight.mesh(geometry.cone(5, 0.02, 0.7), colors.redBandana, 0.82);

    const bandanaCenterTriangle = bandanaGroup.add(node("bandana-center-tip", [0, -0.10, 0.14]));
    bandanaCenterTriangle.scale = [0.18, 0.18, 0.06];
    bandanaCenterTriangle.mesh(geometry.cone(5, 0.01, 0.8), colors.darkRed, 0.85);

    // Bandana tied knot
    const bandanaKnot = bandanaGroup.add(node("bandana-knot", [0.30, -0.04, 0.10]));
    bandanaKnot.scale = [0.08, 0.08, 0.07];
    bandanaKnot.mesh(sphere(6, 5), colors.darkRed, 0.85);

    // Bandana trailing ends
    for (const [index, angle, sz] of [[0, -0.5, 0.22], [1, -0.8, 0.18]]) {
      const tail = bandanaKnot.add(node(`bandana-tail-${index}`, [0.05 + index * 0.05, -0.08 - index * 0.06, 0]));
      tail.rotation[2] = angle;
      tail.scale = [0.07, sz, 0.05];
      tail.mesh(geometry.cone(4, 0.01, 0.7), colors.redBandana, 0.82);
    }


    return gear;
  };
})();
