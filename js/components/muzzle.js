(() => {
  "use strict";

  const { node, geometry, colors } = window.LoboPirata;

  const snoutPalette = [0xd83f0e, 0xeb5314, 0xff7c1a, 0xba300e, 0xff962f, 0x8e2311, 0xd0380e];
  const nosePalette = [0x111319, 0x24232a, 0x353038, 0x090c12, 0x4a3026];
  const jawFurPalette = [0xd83f0e, 0xc2340b, 0x9e2407, 0x7a1804];
  const whiteFurPalette = [0xffffff, 0xffffff, 0xf5f5f5, 0xe0e0e0];

  window.LoboPirata.parts.muzzle = (root) => {
    const muzzleGroup = root.add(node("projecting-muzzle"));

    // Sectioned snout - elongated with deeper Z projection for pronounced 3D wolf profile
    const sections = [
      { z: 0.28, y: 0.05, rx: 0.65, ry: 0.52 },
      { z: 0.52, y: -0.06, rx: 0.58, ry: 0.45 },
      { z: 0.82, y: -0.24, rx: 0.42, ry: 0.34 },
      { z: 1.12, y: -0.44, rx: 0.28, ry: 0.22 },
      { z: 1.38, y: -0.58, rx: 0.18, ry: 0.14 }
    ];
    muzzleGroup.mesh(geometry.snout(sections, 10, snoutPalette), [1, 1, 1], 0.82);

    // Muzzle pads (left & right)
    for (const s of [-1, 1]) {
      const x = (v) => s * v;
      muzzleGroup.mesh(geometry.ellipsoid(x(0.245), -0.51, 1.05, 0.22, 0.16, 0.18, 8, 5, [0xfff0e0, 0xf5e6d3, 0xe5d0b8, 0xfff8ee]), [1, 1, 1], 0.75);
      const padTris = [
        [[x(0.09), -0.44, 1.19], [x(0.28), -0.43, 1.19], [x(0.30), -0.55, 1.20]],
        [[x(0.28), -0.43, 1.19], [x(0.43), -0.53, 1.11], [x(0.30), -0.55, 1.20]],
        [[x(0.30), -0.55, 1.20], [x(0.43), -0.53, 1.11], [x(0.23), -0.65, 1.20]]
      ];
      muzzleGroup.mesh(geometry.surfaceTriangles(padTris, [0xf5e6d3, 0xfff0e0, 0xe5d0b8]), [1, 1, 1], 0.75);
    }

    // Upper Canines & Teeth embedded under upper lip
    for (const s of [-1, 1]) {
      const tooth = muzzleGroup.add(node("upper-canine", [s * 0.14, -0.62, 1.28]));
      tooth.rotation[0] = Math.PI; // Point down
      tooth.rotation[2] = -s * 0.15;
      tooth.scale = [0.035, 0.07, 0.032];
      tooth.mesh(geometry.cone(5, 0.01, 0.5), colors.white, 0.4);
    }

    // Black nose tip and nostrils projecting naturally forward
    muzzleGroup.mesh(geometry.ellipsoid(0, -0.61, 1.445, 0.255, 0.155, 0.16, 9, 5, nosePalette), [1, 1, 1], 0.35);

    const nosePlanes = [
      [[-0.22, -0.58, 1.54], [0, -0.53, 1.575], [0.22, -0.58, 1.54]],
      [[-0.22, -0.58, 1.54], [0, -0.68, 1.565], [0, -0.53, 1.575]],
      [[0, -0.53, 1.575], [0, -0.68, 1.565], [0.22, -0.58, 1.54]]
    ];
    muzzleGroup.mesh(geometry.surfaceTriangles(nosePlanes, [0x393238, 0x55505a, 0x24232b]), [1, 1, 1], 0.35);

    muzzleGroup.mesh(geometry.ellipsoid(-0.125, -0.62, 1.568, 0.047, 0.027, 0.016, 7, 4, [0x05070b, 0x17141a]), [1, 1, 1], 0.2);
    muzzleGroup.mesh(geometry.ellipsoid(0.125, -0.62, 1.568, 0.047, 0.027, 0.016, 7, 4, [0x05070b, 0x17141a]), [1, 1, 1], 0.2);

    // Mouth cavity and jaw
    const mouth = muzzleGroup.add(node("articulated-mouth", [0, 0, 0]));

    const mouthCavity = mouth.add(node("mouth-opening", [0, 0, 0]));
    mouthCavity.mesh(geometry.extrudedPolygon([[-0.19, -0.78], [-0.11, -0.81], [0, -0.79], [0.11, -0.81], [0.19, -0.78], [0.12, -0.86], [0, -0.89], [-0.12, -0.86]], 1.02, 0.055, [0x1a1217, 0x2e1b1d, 0x080a10]), [1, 1, 1], 0.9);

    // Jaw node positioned at jaw joint hinge (pivot y = -0.55, z = 0.50)
    const jaw = mouth.add(node("moving-lower-jaw", [0, -0.55, 0.50]));

    // ANATOMICAL LOWER WOLF JAW STRUCTURE (No spheres/balls!)
    // Lower jaw bone mandible extending along Z axis
    const jawBone = jaw.add(node("jaw-mandible-bone", [0, -0.15, 0.45]));

    // Extruded polygon forming real elongated lower jaw shape with chin tip
    const jawShapePoly = [
      [-0.20, -0.05], [-0.22, 0.35], [-0.15, 0.65], [0.0, 0.72],
      [0.15, 0.65], [0.22, 0.35], [0.20, -0.05]
    ];
    jawBone.mesh(geometry.extrudedPolygon(jawShapePoly, -0.18, 0.16, jawFurPalette), [1, 1, 1], 0.85);

    // Chin tip fur accent (white chin beard patch)
    const chinBeardPoly = [
      [-0.14, 0.42], [-0.12, 0.68], [0.0, 0.76], [0.12, 0.68], [0.14, 0.42]
    ];
    jawBone.mesh(geometry.extrudedPolygon(chinBeardPoly, -0.02, 0.12, whiteFurPalette), [1, 1, 1], 0.78);

    // Lower canines & front teeth array
    for (const side of [-1, 1]) {
      const tooth = jawBone.add(node("lower-canine", [side * 0.12, -0.01, 0.62]));
      tooth.rotation[2] = side * 0.12;
      tooth.scale = [0.032, 0.065, 0.03];
      tooth.mesh(geometry.cone(5, 0.01, 0.5), colors.white, 0.4);
    }
    // Front incisors
    for (const incisorX of [-0.06, -0.02, 0.02, 0.06]) {
      const tooth = jawBone.add(node("lower-incisor", [incisorX, -0.01, 0.66]));
      tooth.scale = [0.018, 0.038, 0.018];
      tooth.mesh(geometry.cone(4, 0.01, 0.5), colors.white, 0.4);
    }

    // Tongue resting inside lower jaw
    const tongue = jawBone.add(node("tongue", [0, -0.02, 0.35]));
    tongue.mesh(geometry.ellipsoid(0, 0, 0, 0.09, 0.02, 0.22, 8, 4, [0x8b180d, 0xaa2013, 0x6e1008]), [1, 1, 1], 0.6);

    return { muzzle: muzzleGroup, mouth, mouthCavity, jaw, tongue };
  };
})();
