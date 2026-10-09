(() => {
  "use strict";

  const { node, geometry, colors } = window.LoboPirata;

  const snoutPalette = [0xe64b12, 0xf45f17, 0xff8421, 0xc63a12, 0xffa03a, 0x9a2b16, 0xdd4212];
  const nosePalette = [0x111319, 0x24232a, 0x353038, 0x090c12, 0x4a3026];

  window.LoboPirata.parts.muzzle = (root) => {
    const muzzleGroup = root.add(node("projecting-muzzle"));

    // Sectioned snout
    const sections = [
      { z: 0.23, y: 0.02, rx: 0.67, ry: 0.50 },
      { z: 0.42, y: -0.09, rx: 0.60, ry: 0.44 },
      { z: 0.66, y: -0.28, rx: 0.43, ry: 0.32 },
      { z: 0.87, y: -0.47, rx: 0.29, ry: 0.21 },
      { z: 1.04, y: -0.59, rx: 0.19, ry: 0.13 }
    ];
    muzzleGroup.mesh(geometry.snout(sections, 9, snoutPalette), [1, 1, 1], 0.82);

    // Muzzle pads (left & right)
    for (const s of [-1, 1]) {
      const x = (v) => s * v;
      muzzleGroup.mesh(geometry.ellipsoid(x(0.245), -0.51, 0.77, 0.22, 0.16, 0.18, 8, 5, [0xfff0e0, 0xf5e6d3, 0xe5d0b8, 0xfff8ee]), [1, 1, 1], 0.75);
      const padTris = [
        [[x(0.09), -0.44, 0.91], [x(0.28), -0.43, 0.91], [x(0.30), -0.55, 0.92]],
        [[x(0.28), -0.43, 0.91], [x(0.43), -0.53, 0.83], [x(0.30), -0.55, 0.92]],
        [[x(0.30), -0.55, 0.92], [x(0.43), -0.53, 0.83], [x(0.23), -0.65, 0.92]]
      ];
      muzzleGroup.mesh(geometry.surfaceTriangles(padTris, [0xf5e6d3, 0xfff0e0, 0xe5d0b8]), [1, 1, 1], 0.75);
    }

    // Black nose tip and nostrils
    muzzleGroup.mesh(geometry.ellipsoid(0, -0.625, 1.105, 0.255, 0.155, 0.16, 9, 5, nosePalette), [1, 1, 1], 0.35);

    const nosePlanes = [
      [[-0.22, -0.60, 1.20], [0, -0.55, 1.235], [0.22, -0.60, 1.20]],
      [[-0.22, -0.60, 1.20], [0, -0.70, 1.225], [0, -0.55, 1.235]],
      [[0, -0.55, 1.235], [0, -0.70, 1.225], [0.22, -0.60, 1.20]]
    ];
    muzzleGroup.mesh(geometry.surfaceTriangles(nosePlanes, [0x393238, 0x55505a, 0x24232b]), [1, 1, 1], 0.35);

    muzzleGroup.mesh(geometry.ellipsoid(-0.125, -0.64, 1.228, 0.047, 0.027, 0.016, 7, 4, [0x05070b, 0x17141a]), [1, 1, 1], 0.2);
    muzzleGroup.mesh(geometry.ellipsoid(0.125, -0.64, 1.228, 0.047, 0.027, 0.016, 7, 4, [0x05070b, 0x17141a]), [1, 1, 1], 0.2);

    // Mouth cavity and jaw
    const mouth = muzzleGroup.add(node("articulated-mouth", [0, 0, 0]));

    const mouthCavity = mouth.add(node("mouth-opening", [0, 0, 0]));
    mouthCavity.mesh(geometry.extrudedPolygon([[-0.19, -0.78], [-0.11, -0.81], [0, -0.79], [0.11, -0.81], [0.19, -0.78], [0.12, -0.86], [0, -0.89], [-0.12, -0.86]], 1.02, 0.055, [0x1a1217, 0x2e1b1d, 0x080a10]), [1, 1, 1], 0.9);

    // Jaw node positioned at jaw joint (y = -0.65, z = 0.75)
    const jaw = mouth.add(node("moving-lower-jaw", [0, -0.65, 0.75]));

    const jawVolume = jaw.add(node("jaw-volume", [0, 0, 0]));
    jawVolume.mesh(geometry.ellipsoid(0, -0.07, 0.10, 0.22, 0.12, 0.25, 8, 5, [0x292127, 0x40241f, 0x5c2b20]), [1, 1, 1], 0.85);

    const chin = jaw.add(node("chin-facet", [0, 0, 0]));
    chin.mesh(geometry.ellipsoid(0, -0.15, 0.20, 0.18, 0.07, 0.15, 7, 4, [0x1d1920, 0x40241f]), [1, 1, 1], 0.88);

    // Lower canines
    for (const side of [-1, 1]) {
      const tooth = jaw.add(node("lower-canine", [side * 0.11, -0.05, 0.23]));
      tooth.rotation[2] = side * 0.15;
      tooth.scale = [0.032, 0.06, 0.03];
      tooth.mesh(geometry.cone(5, 0.01, 0.5), colors.white, 0.5);
    }

    const tongue = jaw.add(node("tongue", [0, -0.05, 0.15]));
    tongue.mesh(geometry.ellipsoid(0, 0, 0, 0.09, 0.02, 0.08, 6, 4, [0x781409, 0xa31e13]), [1, 1, 1], 0.6);

    return { muzzle: muzzleGroup, mouth, mouthCavity, jaw, tongue };
  };
})();
