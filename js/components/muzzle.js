(() => {
  "use strict";

  const { node, geometry, colors } = window.LoboPirata;

  window.LoboPirata.parts.muzzle = (root) => {
    const muzzleGroup = root.add(node("projecting-muzzle"));

    // Angular low-poly snout snout
    const snout = muzzleGroup.add(node("faceted-snout"));
    snout.mesh(geometry.loft([
      [0.32, -0.15, 0.32, 0.28],
      [0.52, -0.32, 0.28, 0.24],
      [0.72, -0.52, 0.23, 0.19],
      [0.92, -0.68, 0.18, 0.15],
      [1.12, -0.78, 0.13, 0.11],
      [1.25, -0.82, 0.08, 0.07],
    ], 12, 16), colors.cream, 0.85);

    // Dark snout bridge transition (orange to cream)
    const snoutBridge = muzzleGroup.add(node("snout-upper-bridge", [0, -0.38, 0.88]));
    snoutBridge.scale = [0.2, 0.35, 0.16];
    snoutBridge.mesh(geometry.cone(6, 0.02, 0.7), colors.foxOrange, 0.82);

    // Black low-poly nose
    const nose = muzzleGroup.add(node("black-nose", [0, -0.82, 1.28]));
    nose.scale = [0.18, 0.12, 0.1];
    nose.mesh(geometry.cone(6, 0.05, 0.6), colors.black, 0.3);

    // Articulated mouth & jaw for talking
    const mouth = muzzleGroup.add(node("articulated-mouth", [0, -0.92, 0.95]));

    const mouthCavity = mouth.add(node("mouth-opening", [0, 0, 0.1]));
    mouthCavity.scale = [0.22, 0.008, 0.06];
    mouthCavity.mesh(geometry.cone(6, 0.01, 0.5), colors.darkFur, 0.9);

    const jaw = mouth.add(node("moving-lower-jaw", [0, -0.02, -0.02]));

    // Jaw low-poly volume (dark/cream lower muzzle)
    const jawVolume = jaw.add(node("jaw-volume", [0, -0.1, 0.02]));
    jawVolume.scale = [0.26, 0.12, 0.18];
    jawVolume.mesh(geometry.cone(6, 0.02, 0.7), colors.foxDark, 0.88);

    // Chin low-poly facet
    const chin = jaw.add(node("chin-facet", [0, -0.18, -0.04]));
    chin.scale = [0.22, 0.06, 0.12];
    chin.mesh(geometry.cone(5, 0.01, 0.6), colors.foxBurgundy, 0.9);

    // Lower canine teeth
    for (const side of [-1, 1]) {
      const tooth = jaw.add(node("lower-canine", [side * 0.14, 0.02, 0.12]));
      tooth.rotation[2] = side * 0.15;
      tooth.scale = [0.038, 0.07, 0.035];
      tooth.mesh(geometry.cone(5, 0.01, 0.5), colors.white, 0.5);
    }

    // Tongue
    const tongue = jaw.add(node("tongue", [0, -0.005, 0.12]));
    tongue.scale = [0.1, 0.02, 0.06];
    tongue.mesh(geometry.cone(6, 0.01, 0.5), colors.redBandana, 0.6);

    return { muzzle: muzzleGroup, mouth, mouthCavity, jaw, tongue };
  };
})();
