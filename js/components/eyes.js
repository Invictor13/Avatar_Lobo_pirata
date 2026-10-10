(() => {
  "use strict";

  const { node, geometry } = window.LoboPirata;

  window.LoboPirata.parts.eyes = (root) => {
    const eyesGroup = root.add(node("wolf-eyes"));

    // Dark orbital socket recession for both left & right
    for (const s of [-1, 1]) {
      const x = s * 0.46;
      eyesGroup.mesh(geometry.ellipsoid(x, 0.41, 0.45, 0.21, 0.14, 0.05, 8, 4, [0x111111, 0x1a1a1f, 0x0d0d10, 0x16161c]), [1, 1, 1], 0.82);
    }

    const eyelids = [];
    const eyes = [];
    const pupilNodes = [];

    // Create both Right (s = 1) and Left (s = -1) eyes with fierce menacing look
    for (const s of [1, -1]) {
      const sideName = s === 1 ? "right" : "left";
      const eyeAssembly = eyesGroup.add(node(`${sideName}-eye-assembly`));
      eyes.push(eyeAssembly);

      const eyeX = s * 0.46;

      // Eyeball base
      const eyeball = eyeAssembly.add(node("eyeball", [eyeX, 0.41, 0.47]));
      eyeball.mesh(geometry.ellipsoid(0, 0, 0, 0.16, 0.10, 0.035, 8, 4, [0x111111, 0x1a1a1e]), [1, 1, 1], 0.7);

      // Intense Glowing Fiery Amber Iris
      const iris = eyeAssembly.add(node("iris", [eyeX, 0.41, 0.49]));
      iris.basePosition = [eyeX, 0.41, 0.49];
      iris.mesh(geometry.ellipsoid(0, 0, 0, 0.125, 0.08, 0.025, 9, 5, [0xff2200, 0xff6600, 0xffa000, 0xc00800]), [1, 1, 1], 0.22);

      // Sharp Vertical Predator Slit Pupil
      const pupil = eyeAssembly.add(node("pupil", [s * (0.46 + 0.005), 0.41, 0.51]));
      pupil.basePosition = [s * (0.46 + 0.005), 0.41, 0.51];
      pupil.mesh(geometry.ellipsoid(0, 0, 0, 0.02, 0.07, 0.015, 6, 4, [0x050202, 0x120404]), [1, 1, 1], 0.1);

      pupilNodes.push({ iris, pupil });

      // Bright Specular Catchlight & Secondary Reflection Dots
      eyeAssembly.mesh(geometry.ellipsoid(s * 0.42, 0.445, 0.525, 0.024, 0.02, 0.012, 6, 4, [0xffffff, 0xffffff]), [1, 1, 1], 0.05);
      eyeAssembly.mesh(geometry.ellipsoid(s * 0.49, 0.385, 0.522, 0.012, 0.011, 0.007, 5, 3, [0xfffae0, 0xffffff]), [1, 1, 1], 0.05);

      // Menacing Slanted Eyebrow Ridge (Dark Black, inner corner down near nose, outer corner up towards ears: \ /)
      const brow = eyeAssembly.add(node("menacing-brow", [s * 0.45, 0.475, 0.51]));
      brow.rotation[2] = s * 0.38; // Aggressive menacing slant \ /
      brow.mesh(geometry.ellipsoid(0, 0, 0, 0.17, 0.045, 0.025, 8, 4, [0x111111, 0x1e1e24, 0x08080a]), [1, 1, 1], 0.82);

      // Menacing Upper Eyelid Fold (Dark Black)
      const angryFold = eyeAssembly.add(node("angry-eyelid-fold", [s * 0.45, 0.445, 0.515]));
      angryFold.rotation[2] = s * 0.32;
      angryFold.mesh(geometry.ellipsoid(0, 0, 0, 0.15, 0.035, 0.02, 8, 4, [0x18181c, 0x222228, 0x101014]), [1, 1, 1], 0.8);

      // Animated Eyelid for Blinking (positioned over top of eye rim)
      const eyelid = eyeAssembly.add(node("eyelid", [eyeX, 0.46, 0.512]));
      eyelid.scale = [1, 0.001, 1];
      eyelid.mesh(geometry.ellipsoid(0, 0, 0, 0.14, 0.065, 0.022, 8, 4, [0x1e1e24, 0x111111]), [1, 1, 1], 0.8);
      eyelids.push(eyelid);
    }

    return { eyes: eyesGroup, pupilNodes, eyelids, eyelid: eyelids[0] };
  };
})();
