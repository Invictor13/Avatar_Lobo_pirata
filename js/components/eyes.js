(() => {
  "use strict";

  const { node, geometry } = window.LoboPirata;

  window.LoboPirata.parts.eyes = (root) => {
    const eyesGroup = root.add(node("wolf-eyes"));

    // Both sockets (left & right)
    for (const s of [-1, 1]) {
      const x = s * 0.48;
      eyesGroup.mesh(geometry.ellipsoid(x, 0.43, 0.43, 0.285, 0.205, 0.13, 9, 5, [0x261920, 0x351d1d, 0x5a281b, 0x120f16]), [1, 1, 1], 0.82);
    }

    const eyelids = [];
    const eyes = [];

    // Create both Right (s = 1) and Left (s = -1) eyes with fierce menacing look
    for (const s of [1, -1]) {
      const sideName = s === 1 ? "right" : "left";
      const eyeAssembly = eyesGroup.add(node(`${sideName}-eye-assembly`));
      eyes.push(eyeAssembly);

      const eyeX = s * 0.48;

      // Eyeball / Socket backing
      const eyeball = eyeAssembly.add(node("eyeball", [eyeX, 0.425, 0.535]));
      eyeball.mesh(geometry.ellipsoid(0, 0, 0, 0.205, 0.128, 0.065, 9, 5, [0x17141b, 0x30201c, 0x6b341c]), [1, 1, 1], 0.7);

      // Intense Glowing Fiery Amber Iris
      const iris = eyeAssembly.add(node("iris", [eyeX, 0.425, 0.59]));
      iris.mesh(geometry.ellipsoid(0, 0, 0, 0.148, 0.093, 0.045, 10, 5, [0xff3300, 0xff7700, 0xffb700, 0xd01000]), [1, 1, 1], 0.22);

      // Sharp Vertical Predator Slit Pupil
      const pupil = eyeAssembly.add(node("pupil", [s * (0.48 + 0.008), 0.425, 0.626]));
      pupil.mesh(geometry.ellipsoid(0, 0, 0, 0.025, 0.082, 0.02, 7, 5, [0x0f0505, 0x1e0808]), [1, 1, 1], 0.1);

      // Specular Glint / Highlights
      eyeAssembly.mesh(geometry.ellipsoid(s * 0.445, 0.465, 0.648, 0.024, 0.020, 0.012, 6, 3, [0xfff5e0, 0xffffff]), [1, 1, 1], 0.1);
      eyeAssembly.mesh(geometry.ellipsoid(s * 0.535, 0.393, 0.646, 0.012, 0.012, 0.008, 5, 3, [0xffefa0]), [1, 1, 1], 0.1);

      // Menacing Slanted Eyebrow Ridge (slanted inwards down towards nose)
      const brow = eyeAssembly.add(node("menacing-brow", [s * 0.46, 0.505, 0.61]));
      brow.rotation[2] = -s * 0.32; // Inward angle for threatening look
      brow.mesh(geometry.ellipsoid(0, 0, 0, 0.20, 0.06, 0.045, 8, 4, [0x8a1e0b, 0xaf2b12, 0x6e1406]), [1, 1, 1], 0.82);

      // Menacing Upper Eyelid Fold (angled down over top of eye)
      const angryFold = eyeAssembly.add(node("angry-eyelid-fold", [s * 0.47, 0.475, 0.618]));
      angryFold.rotation[2] = -s * 0.28;
      angryFold.mesh(geometry.ellipsoid(0, 0, 0, 0.17, 0.045, 0.035, 8, 4, [0xc93412, 0xe55617, 0x90200c]), [1, 1, 1], 0.8);

      // Animated Eyelid for Blinking
      const eyelid = eyeAssembly.add(node("eyelid", [eyeX, 0.425, 0.62]));
      eyelid.scale = [1, 0.001, 1];
      eyelid.mesh(geometry.ellipsoid(0, 0, 0, 0.18, 0.12, 0.04, 8, 4, [0xc93412, 0xe55617]), [1, 1, 1], 0.8);
      eyelids.push(eyelid);
    }

    return { eyes: eyesGroup, eyelids, eyelid: eyelids[0] };
  };
})();
