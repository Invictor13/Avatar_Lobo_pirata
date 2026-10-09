(() => {
  "use strict";

  const { node, geometry, colors } = window.LoboPirata;
  const sphere = geometry.sphere;

  window.LoboPirata.parts.hat = (root) => {
    const hat = root.add(node("pirate-hat", [0, 1.12, -0.02]));

    const brim = hat.add(node("tricorn-brim", [0, 0, 0]));
    brim.scale = [1.13, 0.13, 0.7];
    brim.mesh(sphere(13, 7), colors.leather, 0.7);

    for (const side of [-1, 1]) {
      const wing = hat.add(node("raised-brim-wing", [side * 0.79, 0.08, -0.04]));
      wing.rotation[2] = -side * 0.38;
      wing.scale = [0.48, 0.12, 0.6];
      wing.mesh(sphere(10, 6), [0.22, 0.16, 0.12], 0.73);
    }

    const crown = hat.add(node("hat-crown", [0, 0.39, -0.02]));
    crown.scale = [0.79, 0.62, 0.52];
    crown.mesh(geometry.cylinder(9, 0.84, 0.63), [0.3, 0.22, 0.15], 0.74);

    for (const side of [-1, 1]) {
      const fold = hat.add(node("hat-fold", [side * 0.47, 0.45, 0.32]));
      fold.rotation[2] = -side * 0.4;
      fold.scale = [0.13, 0.49, 0.12];
      fold.mesh(sphere(8, 6), [0.43, 0.32, 0.2], 0.72);
    }

    hat.add(node("gold-hat-band", [0, 0.18, 0.38]))
      .mesh(geometry.tube([
        [-0.68, 0, -0.02], [-0.49, -0.05, 0.02], [-0.25, -0.09, 0.035],
        [0, -0.11, 0.04], [0.25, -0.09, 0.035], [0.49, -0.05, 0.02], [0.68, 0, -0.02],
      ], 0.035, 6), colors.gold, 0.29);

    const skull = hat.add(node("skull-emblem", [0, 0.5, 0.54]));
    skull.scale = [0.2, 0.22, 0.055];
    skull.mesh(sphere(9, 7), colors.bone, 0.52);

    for (const side of [-1, 1]) {
      const socket = hat.add(node("skull-eye-socket", [side * 0.075, 0.54, 0.599]));
      socket.scale = [0.045, 0.055, 0.018];
      socket.mesh(sphere(7, 5), [0.15, 0.105, 0.07], 0.9);
    }
    const skullNose = hat.add(node("skull-nose", [0, 0.44, 0.599]));
    skullNose.scale = [0.029, 0.038, 0.016];
    skullNose.mesh(geometry.cone(5, 0, 0.7), [0.15, 0.105, 0.07], 0.9);

    const crossbones = hat.add(node("crossbones", [0, 0.15, 0.59]));
    crossbones.mesh(geometry.tube([[-0.22, -0.1, 0], [0, 0, 0], [0.22, 0.1, 0]], 0.025, 5), colors.bone, 0.5);
    crossbones.mesh(geometry.tube([[-0.22, 0.1, 0], [0, 0, 0], [0.22, -0.1, 0]], 0.025, 5), colors.bone, 0.5);

    const skullAnimation = hat.add(node("skull-gem", [0, 0.74, 0.57]));
    skullAnimation.scale = [0.065, 0.055, 0.035];
    skullAnimation.mesh(sphere(7, 5), colors.gold, 0.34);
    hat.userData = { skullAnimation };

    return hat;
  };
})();
