(() => {
  "use strict";

  const { node, geometry, colors } = window.LoboPirata;
  const sphere = (w = 10, h = 6) => geometry.sphere(w, h);

  const boneColors = [0xf8f5ee, 0xede8d8, 0xffffff, 0xdcd4c4];
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

    // Subtle gold trim along edge of front brim lip
    const goldTrimFront = hat.add(node("gold-brim-trim-front", [0, 0.33, 0.58]));
    goldTrimFront.scale = [0.82, 0.025, 0.025];
    goldTrimFront.mesh(geometry.cylinder(8, 0.02, 0.8), colors.hatGold, 0.25);

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

    // Gold hat band
    hat.add(node("gold-hat-band", [0, 0.16, 0.4]))
      .mesh(geometry.tube([
        [-0.62, 0, -0.02], [-0.42, -0.05, 0.03], [-0.21, -0.09, 0.04],
        [0, -0.1, 0.045], [0.21, -0.09, 0.04], [0.42, -0.05, 0.03], [0.62, 0, -0.02],
      ], 0.035, 6), colors.hatGold, 0.28);

    // --- ICONIC PIRATE SKULL & CROSSBONES EMBLEM ---
    const skullGroup = hat.add(node("skull-emblem-group", [0, 0.28, 0.62]));
    skullGroup.scale = [1.3, 1.3, 1.3];

    // 1. Crossbones behind skull (X shape)
    const boneRadius = 0.022;
    const boneLength = 0.32;

    // Crossbone 1 (\)
    const bone1 = skullGroup.add(node("bone-1", [0, 0, -0.01]));
    bone1.rotation[2] = Math.PI / 4;
    bone1.mesh(geometry.cylinder(6, boneRadius, boneLength), boneColors, 0.4);

    // Crossbone 2 (/)
    const bone2 = skullGroup.add(node("bone-2", [0, 0, -0.01]));
    bone2.rotation[2] = -Math.PI / 4;
    bone2.mesh(geometry.cylinder(6, boneRadius, boneLength), boneColors, 0.4);

    // Bone ends (knobs)
    const boneEnds = [
      [-0.12, 0.12], [0.12, 0.12], [-0.12, -0.12], [0.12, -0.12]
    ];
    for (const [bx, by] of boneEnds) {
      for (const offset of [-0.018, 0.018]) {
        const knob = skullGroup.add(node("bone-knob", [bx + offset, by, -0.008]));
        knob.scale = [0.022, 0.022, 0.018];
        knob.mesh(sphere(6, 4), boneColors, 0.4);
      }
    }

    // 2. Skull Cranium / Dome
    const cranium = skullGroup.add(node("skull-cranium", [0, 0.05, 0.01]));
    cranium.scale = [0.12, 0.11, 0.05];
    cranium.mesh(sphere(8, 6), boneColors, 0.35);

    // Brow Ridge
    const browRidge = skullGroup.add(node("skull-brow", [0, 0.07, 0.035]));
    browRidge.scale = [0.11, 0.025, 0.025];
    browRidge.mesh(sphere(8, 4), boneColors, 0.35);

    // 3. Dark Eye Sockets
    for (const side of [-1, 1]) {
      const socket = skullGroup.add(node("skull-eye-socket", [side * 0.042, 0.05, 0.04]));
      socket.rotation[2] = -side * 0.25;
      socket.scale = [0.032, 0.036, 0.015];
      socket.mesh(sphere(6, 4), darkBone, 0.95);
    }

    // 4. Nasal Cavity (Triangle)
    const noseCavity = skullGroup.add(node("skull-nose-cavity", [0, 0.018, 0.042]));
    noseCavity.scale = [0.018, 0.025, 0.012];
    noseCavity.mesh(geometry.cone(4, 0.0, 0.5), darkBone, 0.95);

    // 5. Maxilla / Jaw & Teeth
    const maxilla = skullGroup.add(node("skull-maxilla", [0, -0.025, 0.03]));
    maxilla.scale = [0.07, 0.035, 0.03];
    maxilla.mesh(sphere(6, 4), boneColors, 0.35);

    // Teeth detail
    for (const tx of [-0.03, -0.01, 0.01, 0.03]) {
      const tooth = skullGroup.add(node("skull-tooth", [tx, -0.042, 0.038]));
      tooth.scale = [0.008, 0.015, 0.008];
      tooth.mesh(sphere(4, 3), [0xffffff, 0xf0ece1], 0.3);
    }

    return hat;
  };
})();
