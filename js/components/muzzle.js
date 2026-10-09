(() => {
  "use strict";

  const { node, geometry, colors } = window.LoboPirata;
  const sphere = (width = 20, height = 14) => geometry.sphere(width, height);

  window.LoboPirata.parts.muzzle = (root) => {
    const muzzleGroup = root.add(node("projecting-muzzle"));
    const snout = muzzleGroup.add(node("elongated-snout"));
    snout.mesh(geometry.loft([
      [0.43, -0.28, 0.29, 0.25],
      [0.54, -0.35, 0.27, 0.23],
      [0.68, -0.45, 0.24, 0.2],
      [0.84, -0.57, 0.205, 0.17],
      [1.02, -0.68, 0.18, 0.145],
      [1.2, -0.75, 0.16, 0.125],
      [1.34, -0.77, 0.135, 0.105],
      [1.42, -0.77, 0.075, 0.065],
      [1.45, -0.77, 0.012, 0.012],
    ], 40, 60), [0.83, 0.57, 0.42], 0.9);

    for (const side of [-1, 1]) {
      const nostril = muzzleGroup.add(node("nostril", [side * 0.095, -0.765, 1.45]));
      nostril.scale = [0.031, 0.024, 0.019];
      nostril.mesh(sphere(14, 10), [0.035, 0.027, 0.025], 0.42);

      for (const [index, mark] of [[0, 0], [1, -0.045], [2, 0.045]].entries()) {
        const freckle = muzzleGroup.add(node("whisker-freckle", [
          side * (0.18 + index * 0.025),
          -0.52 + mark,
          0.96 + index * 0.025,
        ]));
        freckle.scale = [0.018, 0.014, 0.012];
        freckle.mesh(sphere(10, 8), [0.35, 0.2, 0.13], 0.88);
      }
    }

    const nose = muzzleGroup.add(node("shaped-black-nose", [0, -0.76, 1.45]));
    nose.scale = [0.16, 0.11, 0.085];
    nose.mesh(sphere(20, 15), [0.045, 0.04, 0.043], 0.22);

    const noseHighlight = nose.add(node("nose-reflection", [-0.055, 0.043, 0.89]));
    noseHighlight.scale = [0.38, 0.13, 0.12];
    noseHighlight.mesh(sphere(14, 10), [0.39, 0.33, 0.28], 0.18);

    const mouth = muzzleGroup.add(node("articulated-mouth", [0, -0.94, 1.02]));
    const mouthCavity = mouth.add(node("mouth-opening", [0, 0, 0.105]));
    mouthCavity.scale = [0.23, 0.008, 0.065];
    mouthCavity.mesh(sphere(18, 12), [0.075, 0.018, 0.023], 0.91);

    const upperLip = mouth.add(node("upper-lip", [0, 0.028, 0.1]));
    upperLip.mesh(geometry.tube([
      [-0.21, 0, 0], [-0.14, -0.035, 0.014], [0, -0.045, 0.025],
      [0.14, -0.035, 0.014], [0.21, 0, 0],
    ], 0.023, 7), [0.33, 0.17, 0.13], 0.87);

    const jaw = mouth.add(node("moving-lower-jaw", [0, -0.025, -0.03]));
    const jawVolume = jaw.add(node("jaw-volume", [0, -0.11, 0.025]));
    jawVolume.scale = [0.285, 0.125, 0.205];
    jawVolume.mesh(sphere(20, 14), [0.52, 0.31, 0.22], 0.92);

    const chin = jaw.add(node("dark-chin", [0, -0.195, -0.035]));
    chin.scale = [0.235, 0.055, 0.145];
    chin.mesh(sphere(16, 11), colors.darkFur, 0.95);

    for (const side of [-1, 1]) {
      const tooth = jaw.add(node("lower-canine", [side * 0.17, 0.025, 0.13]));
      tooth.rotation[2] = side * 0.13;
      tooth.scale = [0.041, 0.072, 0.036];
      tooth.mesh(geometry.cone(12, 0.01, 0.55), colors.white, 0.56);
    }

    const tongue = jaw.add(node("tongue", [0, -0.006, 0.132]));
    tongue.scale = [0.1, 0.023, 0.07];
    tongue.mesh(sphere(16, 12), [0.65, 0.12, 0.17], 0.54);

    return { muzzle: muzzleGroup, mouth, mouthCavity, jaw, tongue };
  };
})();
