(() => {
  "use strict";

  const { node, geometry, colors } = window.LoboPirata;
  const sphere = (w = 10, h = 6) => geometry.sphere(w, h);

  const boneColors = [0xfbf9f5, 0xf0ede6, 0xe5e0d8, 0xffffff];
  const darkBone = [0x050505, 0x000000];

  window.LoboPirata.parts.hat = (root) => {
    // Hat position on head
    const hat = root.add(node("pirate-hat", [0, 0.95, 0.05]));

    // Tricorn main brim structure
    const brim = hat.add(node("tricorn-brim", [0, 0, 0]));
    brim.scale = [1.65, 0.18, 1.1];
    brim.mesh(sphere(12, 6), colors.leather, 0.75);

    // Raised brim wings (turned up sides of tricorn)
    for (const side of [-1, 1]) {
      const wing = hat.add(node("raised-brim-wing", [side * 0.82, 0.20, -0.05]));
      wing.rotation[2] = -side * 0.38;
      wing.scale = [0.58, 0.18, 0.8];
      wing.mesh(sphere(10, 6), colors.leather, 0.75);
    }

    // Turned up front brim lip
    const frontLip = hat.add(node("front-brim-lip", [0, 0.22, 0.55]));
    frontLip.rotation[0] = 0.35;
    frontLip.scale = [0.85, 0.25, 0.12];
    frontLip.mesh(sphere(10, 6), colors.leather, 0.78);

    // Hat crown
    const crown = hat.add(node("hat-crown", [0, 0.38, -0.02]));
    crown.scale = [0.95, 0.55, 0.72];
    crown.mesh(geometry.cylinder(8, 0.72, 0.52), colors.leather, 0.75);

    // Folded sides
    for (const side of [-1, 1]) {
      const fold = hat.add(node("hat-fold", [side * 0.42, 0.38, 0.3]));
      fold.rotation[2] = -side * 0.38;
      fold.scale = [0.12, 0.45, 0.12];
      fold.mesh(sphere(8, 6), [0.22, 0.18, 0.16], 0.72);
    }

    // Gold hat band around crown base
    hat.add(node("gold-hat-band", [0, 0.16, 0.4]))
      .mesh(geometry.tube([
        [-0.62, 0, -0.02], [-0.42, -0.05, 0.03], [-0.21, -0.09, 0.04],
        [0, -0.1, 0.045], [0.21, -0.09, 0.04], [0.42, -0.05, 0.03], [0.62, 0, -0.02],
      ], 0.035, 6), colors.hatGold, 0.28);

    // --- ICONIC BONE-WHITE PIRATE SKULL & CROSSBONES EMBLEM ---
    const skullGroup = hat.add(node("skull-emblem-group", [0, 0.38, 0.56]));
    skullGroup.rotation[0] = -0.12;

    // 1. Crossbones behind skull (X shape using clean tubes)
    const boneRadius = 0.022;
    const crossbone1 = skullGroup.add(node("crossbone-1"));
    crossbone1.mesh(geometry.tube([[-0.18, -0.18, -0.01], [0.18, 0.18, -0.01]], boneRadius, 6), boneColors, 0.35);

    const crossbone2 = skullGroup.add(node("crossbone-2"));
    crossbone2.mesh(geometry.tube([[-0.18, 0.18, -0.01], [0.18, -0.18, -0.01]], boneRadius, 6), boneColors, 0.35);

    // Bone ends (knobs on each tip)
    const boneTips = [
      [-0.18, 0.18], [0.18, 0.18], [-0.18, -0.18], [0.18, -0.18]
    ];
    for (const [bx, by] of boneTips) {
      for (const [ox, oy] of [[-0.018, 0.012], [0.018, -0.012]]) {
        const knob = skullGroup.add(node("bone-knob", [bx + ox, by + oy, -0.01]));
        knob.scale = [0.028, 0.028, 0.022];
        knob.mesh(sphere(6, 4), boneColors, 0.35);
      }
    }

    // 2. Skull Cranium (Main head dome)
    const cranium = skullGroup.add(node("skull-cranium", [0, 0.04, 0.01]));
    cranium.mesh(geometry.ellipsoid(0, 0, 0, 0.12, 0.11, 0.05, 10, 8, boneColors), [1, 1, 1], 0.35);

    // Brow Ridge
    const browRidge = skullGroup.add(node("skull-brow", [0, 0.065, 0.035]));
    browRidge.mesh(geometry.ellipsoid(0, 0, 0, 0.11, 0.025, 0.025, 8, 4, boneColors), [1, 1, 1], 0.35);

    // 3. Eye Sockets (Dark black recesses)
    for (const side of [-1, 1]) {
      const socket = skullGroup.add(node("skull-eye-socket", [side * 0.042, 0.045, 0.04]));
      socket.rotation[2] = -side * 0.2;
      socket.mesh(geometry.ellipsoid(0, 0, 0, 0.032, 0.036, 0.018, 8, 6, darkBone), [1, 1, 1], 0.95);
    }

    // 4. Nasal Cavity (Dark inverted triangle)
    const noseCavity = skullGroup.add(node("skull-nose-cavity", [0, 0.012, 0.042]));
    noseCavity.rotation[0] = Math.PI; // upside down cone for nose cavity
    noseCavity.scale = [0.022, 0.025, 0.015];
    noseCavity.mesh(geometry.cone(4, 0.0, 0.5), darkBone, 0.95);

    // 5. Maxilla / Jaw & Teeth
    const maxilla = skullGroup.add(node("skull-maxilla", [0, -0.038, 0.028]));
    maxilla.mesh(geometry.ellipsoid(0, 0, 0, 0.07, 0.035, 0.03, 8, 6, boneColors), [1, 1, 1], 0.35);

    // Individual teeth detail
    for (const tx of [-0.032, -0.011, 0.011, 0.032]) {
      const tooth = skullGroup.add(node("skull-tooth", [tx, -0.055, 0.036]));
      tooth.mesh(geometry.ellipsoid(0, 0, 0, 0.007, 0.014, 0.008, 6, 4, [0xffffff, 0xf2eee3]), [1, 1, 1], 0.3);
    }

    return hat;
  };
})();
