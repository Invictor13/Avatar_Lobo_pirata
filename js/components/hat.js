(() => {
  "use strict";

  const { node, geometry, colors } = window.LoboPirata;
  const sphere = (w = 10, h = 6) => geometry.sphere(w, h);

  const boneColors = [0xe8e2d5, 0xdcd4c4, 0xf4efe6, 0xc7bea9];
  const darkBone = [0x221c18, 0x110d0a];

  window.LoboPirata.parts.hat = (root) => {
    // Hat position lowered to 0.92
    const hat = root.add(node("pirate-hat", [0, 0.92, 0.05]));

    // Tricorn main brim structure
    const brim = hat.add(node("tricorn-brim", [0, 0, 0]));
    brim.scale = [1.65, 0.2, 1.1];
    brim.mesh(sphere(12, 6), colors.leather, 0.75);

    // Raised brim wings
    for (const side of [-1, 1]) {
      const wing = hat.add(node("raised-brim-wing", [side * 0.88, 0.18, -0.05]));
      wing.rotation[2] = -side * 0.38;
      wing.scale = [0.58, 0.18, 0.8];
      wing.mesh(sphere(10, 6), colors.leather, 0.75);
    }

    // Gold trim edge around front and sides of hat brim
    const goldTrimFront = hat.add(node("gold-brim-trim-front", [0, 0.09, 0.62]));
    goldTrimFront.scale = [0.88, 0.08, 0.12];
    goldTrimFront.mesh(geometry.cone(6, 0.02, 0.6), colors.hatGold, 0.25);

    for (const side of [-1, 1]) {
      const goldTrimWing = hat.add(node("gold-brim-trim-wing", [side * 0.82, 0.35, 0.18]));
      goldTrimWing.rotation[2] = -side * 0.42;
      goldTrimWing.scale = [0.15, 0.6, 0.12];
      goldTrimWing.mesh(geometry.cone(5, 0.02, 0.6), colors.hatGold, 0.25);
    }

    // Hat crown
    const crown = hat.add(node("hat-crown", [0, 0.38, -0.02]));
    crown.scale = [1.0, 0.6, 0.75];
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

    // --- REFINED PIRATE SKULL & CROSSBONES EMBLEM ---
    const skullGroup = hat.add(node("skull-emblem-group", [0, 0.45, 0.51]));

    // 1. Crossbones behind skull
    const boneRadius = 0.022;
    const boneLength = 0.30;
    // Diagonal bone 1 (\)
    const bone1 = skullGroup.add(node("bone-1", [0, 0.02, -0.01]));
    bone1.rotation[2] = Math.PI / 4;
    bone1.mesh(geometry.cylinder(6, boneRadius, boneLength), boneColors, 0.4);

    // Diagonal bone 2 (/)
    const bone2 = skullGroup.add(node("bone-2", [0, 0.02, -0.01]));
    bone2.rotation[2] = -Math.PI / 4;
    bone2.mesh(geometry.cylinder(6, boneRadius, boneLength), boneColors, 0.4);

    // Bone knobby joints at the four ends
    const boneEnds = [
      [-0.19, 0.21], [0.19, 0.21], [-0.19, -0.17], [0.19, -0.17]
    ];
    for (const [bx, by] of boneEnds) {
      for (const offset of [-0.015, 0.015]) {
        const knob = skullGroup.add(node("bone-knob", [bx + offset, by, -0.01]));
        knob.scale = [0.025, 0.025, 0.02];
        knob.mesh(sphere(6, 4), boneColors, 0.4);
      }
    }

    // 2. Cranium / Skull dome
    const cranium = skullGroup.add(node("skull-cranium", [0, 0.09, 0.01]));
    cranium.scale = [0.18, 0.16, 0.08];
    cranium.mesh(sphere(8, 6), boneColors, 0.35);

    // Brow ridge / Forehead overhang
    const browRidge = skullGroup.add(node("skull-brow", [0, 0.12, 0.05]));
    browRidge.scale = [0.17, 0.035, 0.04];
    browRidge.mesh(sphere(8, 4), boneColors, 0.35);

    // Cheekbones (Zygomatic arches)
    for (const side of [-1, 1]) {
      const cheek = skullGroup.add(node("skull-cheek", [side * 0.13, 0.04, 0.04]));
      cheek.rotation[2] = side * -0.25;
      cheek.scale = [0.04, 0.07, 0.03];
      cheek.mesh(sphere(6, 4), boneColors, 0.35);
    }

    // 3. Deep angular Eye Sockets
    for (const side of [-1, 1]) {
      const socket = skullGroup.add(node("skull-eye-socket", [side * 0.065, 0.085, 0.052]));
      socket.rotation[2] = -side * 0.2; // Aggressive angled eyes
      socket.scale = [0.048, 0.052, 0.022];
      socket.mesh(sphere(6, 4), darkBone, 0.9);
    }

    // 4. Inverted-V Nasal Cavity
    const noseCavity = skullGroup.add(node("skull-nose-cavity", [0, 0.035, 0.055]));
    noseCavity.scale = [0.028, 0.038, 0.02];
    noseCavity.mesh(geometry.cone(4, 0.0, 0.6), darkBone, 0.9);

    // 5. Upper Maxilla & Teeth Grid
    const maxilla = skullGroup.add(node("skull-maxilla", [0, -0.02, 0.038]));
    maxilla.scale = [0.10, 0.05, 0.05];
    maxilla.mesh(sphere(6, 4), boneColors, 0.35);

    // Tooth vertical separation facets
    for (const tx of [-0.05, -0.02, 0.02, 0.05]) {
      const tooth = skullGroup.add(node("skull-tooth", [tx, -0.048, 0.055]));
      tooth.scale = [0.012, 0.022, 0.012];
      tooth.mesh(sphere(5, 4), [0xffffff, 0xe8e2d5], 0.3);
    }

    // Lower Mandible Jaw
    const mandible = skullGroup.add(node("skull-mandible", [0, -0.08, 0.03]));
    mandible.scale = [0.08, 0.035, 0.04];
    mandible.mesh(sphere(6, 4), boneColors, 0.4);

    // Skull glowing gem / crown ornament on forehead
    const skullAnimation = skullGroup.add(node("skull-gem", [0, 0.20, 0.02]));
    skullAnimation.scale = [0.04, 0.04, 0.03];
    skullAnimation.mesh(sphere(6, 4), colors.hatGold, 0.2);

    hat.userData = { skullAnimation };
    return hat;
  };
})();
