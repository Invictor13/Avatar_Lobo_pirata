(() => {
  "use strict";

  const { node, geometry, colors } = window.LoboPirata;
  const sphere = (w = 10, h = 6) => geometry.sphere(w, h);

  window.LoboPirata.parts.hat = (root) => {
    const hat = root.add(node("pirate-hat", [0, 0.98, -0.02]));

    // Tricorn main brim structure
    const brim = hat.add(node("tricorn-brim", [0, 0, 0]));
    brim.scale = [1.22, 0.14, 0.75];
    brim.mesh(sphere(12, 6), colors.leather, 0.75);

    // Raised brim wings
    for (const side of [-1, 1]) {
      const wing = hat.add(node("raised-brim-wing", [side * 0.82, 0.12, -0.04]));
      wing.rotation[2] = -side * 0.42;
      wing.scale = [0.52, 0.14, 0.65];
      wing.mesh(sphere(10, 6), colors.leather, 0.75);
    }

    // Gold trim edge around front and sides of hat brim (matching logo.jpg gold brim outline)
    const goldTrimFront = hat.add(node("gold-brim-trim-front", [0, 0.08, 0.48]));
    goldTrimFront.scale = [0.72, 0.08, 0.12];
    goldTrimFront.mesh(geometry.cone(6, 0.02, 0.6), colors.hatGold, 0.25);

    for (const side of [-1, 1]) {
      const goldTrimWing = hat.add(node("gold-brim-trim-wing", [side * 0.72, 0.35, 0.18]));
      goldTrimWing.rotation[2] = -side * 0.45;
      goldTrimWing.scale = [0.15, 0.62, 0.1];
      goldTrimWing.mesh(geometry.cone(5, 0.02, 0.6), colors.hatGold, 0.25);
    }

    // Hat crown
    const crown = hat.add(node("hat-crown", [0, 0.42, -0.02]));
    crown.scale = [0.82, 0.65, 0.55];
    crown.mesh(geometry.cylinder(8, 0.82, 0.62), colors.leather, 0.75);

    // Folded sides
    for (const side of [-1, 1]) {
      const fold = hat.add(node("hat-fold", [side * 0.48, 0.48, 0.34]));
      fold.rotation[2] = -side * 0.42;
      fold.scale = [0.14, 0.52, 0.14];
      fold.mesh(sphere(8, 6), [0.22, 0.18, 0.16], 0.72);
    }

    // Gold hat band
    hat.add(node("gold-hat-band", [0, 0.2, 0.4]))
      .mesh(geometry.tube([
        [-0.7, 0, -0.02], [-0.5, -0.05, 0.02], [-0.25, -0.09, 0.035],
        [0, -0.11, 0.04], [0.25, -0.09, 0.035], [0.5, -0.05, 0.02], [0.7, 0, -0.02],
      ], 0.038, 6), colors.hatGold, 0.28);

    // Glowing skull emblem on hat center
    const skullGroup = hat.add(node("skull-emblem-group", [0, 0.52, 0.56]));

    const skull = skullGroup.add(node("pixel-skull-head", [0, 0.06, 0]));
    skull.scale = [0.2, 0.2, 0.05];
    skull.mesh(sphere(8, 6), colors.skullYellow, 0.3);

    // Skull eye sockets
    for (const side of [-1, 1]) {
      const socket = skullGroup.add(node("skull-eye", [side * 0.07, 0.09, 0.038]));
      socket.scale = [0.045, 0.05, 0.015];
      socket.mesh(sphere(6, 4), colors.black, 0.9);
    }

    // Skull nose
    const skullNose = skullGroup.add(node("skull-nose", [0, 0.02, 0.038]));
    skullNose.scale = [0.028, 0.035, 0.012];
    skullNose.mesh(geometry.cone(4, 0, 0.6), colors.black, 0.9);

    // Skull teeth/jaw grid (pixelated skull look)
    const skullJaw = skullGroup.add(node("skull-jaw", [0, -0.06, 0.03]));
    skullJaw.scale = [0.12, 0.06, 0.015];
    skullJaw.mesh(sphere(6, 4), colors.skullYellow, 0.3);

    // Crossbones
    const crossbones = skullGroup.add(node("crossbones", [0, -0.16, 0.02]));
    crossbones.mesh(geometry.tube([[-0.24, -0.12, 0], [0, 0, 0], [0.24, 0.12, 0]], 0.025, 5), colors.skullYellow, 0.3);
    crossbones.mesh(geometry.tube([[-0.24, 0.12, 0], [0, 0, 0], [0.24, -0.12, 0]], 0.025, 5), colors.skullYellow, 0.3);

    // Skull glowing gem animation hook
    const skullAnimation = skullGroup.add(node("skull-gem", [0, 0.22, 0.02]));
    skullAnimation.scale = [0.06, 0.05, 0.03];
    skullAnimation.mesh(sphere(6, 4), colors.hatGold, 0.2);

    hat.userData = { skullAnimation };
    return hat;
  };
})();
