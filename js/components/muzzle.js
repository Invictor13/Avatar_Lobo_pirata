(() => {
  "use strict";

  const { node, geometry, colors } = window.LoboPirata;

  window.LoboPirata.parts.muzzle = (root) => {
    const muzzleGroup = root.add(node("projecting-muzzle"));

    // Angular low-poly snout pointing forward horizontally
    const snout = muzzleGroup.add(node("faceted-snout"));
    snout.mesh(geometry.loft([
      [0.35, -0.05, 0.28, 0.24],
      [0.55, -0.07, 0.24, 0.20],
      [0.75, -0.09, 0.20, 0.16],
      [0.95, -0.11, 0.15, 0.12],
      [1.10, -0.12, 0.10, 0.08],
      [1.22, -0.13, 0.06, 0.05],
    ], 12, 16), colors.cream, 0.85);

    // Upper snout bridge
    const snoutBridge = muzzleGroup.add(node("snout-upper-bridge", [0, 0.02, 0.75]));
    snoutBridge.scale = [0.18, 0.14, 0.38];
    snoutBridge.mesh(geometry.cone(6, 0.02, 0.7), colors.foxOrange, 0.82);

    // Black low-poly nose at the tip
    const nose = muzzleGroup.add(node("black-nose", [0, -0.11, 1.25]));
    nose.scale = [0.15, 0.11, 0.09];
    nose.mesh(geometry.cone(6, 0.05, 0.6), colors.black, 0.3);

    // Articulated mouth & jaw
    const mouth = muzzleGroup.add(node("articulated-mouth", [0, -0.22, 0.75]));

    const mouthCavity = mouth.add(node("mouth-opening", [0, 0, 0.15]));
    mouthCavity.scale = [0.2, 0.008, 0.15];
    mouthCavity.mesh(geometry.cone(6, 0.01, 0.5), colors.darkFur, 0.9);

    const jaw = mouth.add(node("moving-lower-jaw", [0, -0.08, 0]));

    // Jaw volume
    const jawVolume = jaw.add(node("jaw-volume", [0, -0.05, 0.15]));
    jawVolume.scale = [0.22, 0.11, 0.25];
    jawVolume.mesh(geometry.cone(6, 0.02, 0.7), colors.foxDark, 0.88);

    // Chin facet
    const chin = jaw.add(node("chin-facet", [0, -0.12, 0.05]));
    chin.scale = [0.18, 0.05, 0.15];
    chin.mesh(geometry.cone(5, 0.01, 0.6), colors.foxBurgundy, 0.9);

    // Lower canine teeth
    for (const side of [-1, 1]) {
      const tooth = jaw.add(node("lower-canine", [side * 0.11, 0.04, 0.18]));
      tooth.rotation[2] = side * 0.15;
      tooth.scale = [0.032, 0.06, 0.03];
      tooth.mesh(geometry.cone(5, 0.01, 0.5), colors.white, 0.5);
    }

    // Tongue
    const tongue = jaw.add(node("tongue", [0, 0.01, 0.18]));
    tongue.scale = [0.09, 0.02, 0.08];
    tongue.mesh(geometry.cone(6, 0.01, 0.5), colors.redBandana, 0.6);

    return { muzzle: muzzleGroup, mouth, mouthCavity, jaw, tongue };
  };
})();
