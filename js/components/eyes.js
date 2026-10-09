(() => {
  "use strict";

  const { node, geometry } = window.LoboPirata;

  const goldPalette = [0xe8a83b, 0xffcf69, 0xb97a1d];
  const leatherPalette = [0x171a20, 0x25252a, 0x393536, 0x4a4239, 0x1a1a21];

  window.LoboPirata.parts.eyes = (root) => {
    const eyesGroup = root.add(node("wolf-eyes"));

    // Both sockets (left & right)
    for (const s of [-1, 1]) {
      const x = s * 0.48;
      eyesGroup.mesh(geometry.ellipsoid(x, 0.43, 0.43, 0.285, 0.205, 0.13, 9, 5, [0x261920, 0x351d1d, 0x5a281b, 0x120f16]), [1, 1, 1], 0.82);
    }

    // Right Eye (uncovered)
    const rightEye = eyesGroup.add(node("right-eye-assembly"));

    // Eyeball / Socket backing
    const eyeball = rightEye.add(node("eyeball", [0.48, 0.425, 0.535]));
    eyeball.mesh(geometry.ellipsoid(0, 0, 0, 0.205, 0.128, 0.065, 9, 5, [0x17141b, 0x30201c, 0x6b341c]), [1, 1, 1], 0.7);

    // Amber Iris
    const iris = rightEye.add(node("iris", [0.48, 0.425, 0.59]));
    iris.mesh(geometry.ellipsoid(0, 0, 0, 0.145, 0.091, 0.045, 10, 5, [0xffa51d, 0xffbd38, 0xe36c12, 0xffd05b]), [1, 1, 1], 0.22);

    // Vertical Pupil
    const pupil = rightEye.add(node("pupil", [0.49, 0.425, 0.626]));
    pupil.mesh(geometry.ellipsoid(0, 0, 0, 0.036, 0.074, 0.02, 7, 5, [0x160e0d, 0x25100a]), [1, 1, 1], 0.1);

    // Highlights
    rightEye.mesh(geometry.ellipsoid(0.445, 0.465, 0.648, 0.026, 0.022, 0.012, 6, 3, [0xfff0c0, 0xffffff]), [1, 1, 1], 0.1);
    rightEye.mesh(geometry.ellipsoid(0.535, 0.393, 0.646, 0.012, 0.012, 0.008, 5, 3, [0xffefaf]), [1, 1, 1], 0.1);

    // Eyelid node for blinking animation
    const eyelid = rightEye.add(node("eyelid", [0.48, 0.425, 0.62]));
    eyelid.scale = [1, 0.001, 1];
    eyelid.mesh(geometry.ellipsoid(0, 0, 0, 0.18, 0.12, 0.04, 8, 4, [0xc93412, 0xe55617]), [1, 1, 1], 0.8);

    // Eyepatch (Left eye cover)
    const eyepatch = eyesGroup.add(node("pirate-eyepatch"));

    // Brass outer rim
    const outerRim = [[-0.93, 0.77], [-0.48, 0.88], [-0.17, 0.69], [-0.13, 0.36], [-0.34, 0.08], [-0.67, 0.02], [-0.88, 0.25]];
    eyepatch.mesh(geometry.extrudedPolygon(outerRim, 0.665, 0.10, [0x9b6b2e, 0xe0a53e, 0x6e4524]), [1, 1, 1], 0.28);

    // Leather patch body
    const innerPatch = [[-0.88, 0.72], [-0.50, 0.81], [-0.23, 0.65], [-0.20, 0.38], [-0.39, 0.15], [-0.65, 0.10], [-0.82, 0.29]];
    eyepatch.mesh(geometry.extrudedPolygon(innerPatch, 0.735, 0.11, leatherPalette), [1, 1, 1], 0.58);

    // Faceted surface details
    const patchTris = [
      [[-0.84, 0.68, 0.80], [-0.53, 0.77, 0.80], [-0.64, 0.52, 0.80]],
      [[-0.53, 0.77, 0.80], [-0.25, 0.63, 0.80], [-0.64, 0.52, 0.80]],
      [[-0.64, 0.52, 0.80], [-0.25, 0.63, 0.80], [-0.42, 0.31, 0.80]],
      [[-0.64, 0.52, 0.80], [-0.42, 0.31, 0.80], [-0.67, 0.17, 0.80]],
      [[-0.67, 0.17, 0.80], [-0.42, 0.31, 0.80], [-0.79, 0.31, 0.80]]
    ];
    eyepatch.mesh(geometry.surfaceTriangles(patchTris, [0x48464a, 0x78634c, 0x2a2a2c, 0x161820, 0x514338]), [1, 1, 1], 0.58);

    // Strap
    const strapPts = [[-1.08, 0.96], [-0.94, 0.70], [-0.52, 0.85], [-0.10, 1.00], [0.34, 1.15], [0.47, 1.35], [0.25, 1.34], [-0.21, 1.19], [-0.67, 1.04]];
    eyepatch.mesh(geometry.extrudedPolygon(strapPts, 0.48, 0.09, [0x191a20, 0x29252a, 0x443029, 0x241d20]), [1, 1, 1], 0.58);

    // Golden strap piping / trim
    const trimTube = geometry.tube([[-0.91, 0.76, 0.545], [-0.53, 0.90, 0.545], [-0.1, 1.05, 0.545], [0.30, 1.19, 0.545]], 0.012, 6);
    eyepatch.mesh(trimTube, goldPalette[0], 0.3);

    return { eyes: eyesGroup, rightEye, eyeball, iris, pupil, eyelid, eyepatch };
  };
})();
