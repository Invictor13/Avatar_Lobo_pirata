(() => {
  "use strict";

  const { node, geometry, colors } = window.LoboPirata;

  window.LoboPirata.parts.fur = (root) => {
    const mane = root.add(node("facial-fur-spikes"));

    // Distinct low-poly angular spikes on sides of the face (cheek & mane tufts)
    for (const side of [-1, 1]) {
      const tufts = [
        // Temple spike pointing outward
        { name: "temple-spike", position: [0.72, 0.22, 0.65], rotation: [0.1, 0, -side * 1.95], scale: [0.22, 0.45, 0.16], color: colors.foxOrange },
        // Mid cheek spike
        { name: "mid-cheek-spike", position: [0.82, -0.08, 0.68], rotation: [0.15, 0, -side * 2.2], scale: [0.26, 0.52, 0.18], color: colors.foxAmber },
        // Lower cheek main spike
        { name: "lower-cheek-spike", position: [0.78, -0.38, 0.72], rotation: [0.2, 0, -side * 2.38], scale: [0.28, 0.55, 0.18], color: colors.foxOrange },
        // Jaw/Neck side spike
        { name: "jaw-side-spike", position: [0.65, -0.68, 0.65], rotation: [0.25, 0, -side * 2.52], scale: [0.24, 0.48, 0.16], color: colors.foxAmber },
        // Inner cheek white/cream facet tuft
        { name: "inner-cheek-tuft", position: [0.42, -0.42, 0.82], rotation: [0.1, 0, -side * 2.1], scale: [0.18, 0.38, 0.12], color: colors.cream },
      ];

      for (const tuft of tufts) {
        const spike = mane.add(node(tuft.name, [
          side * tuft.position[0],
          tuft.position[1],
          tuft.position[2],
        ]));
        spike.rotation = [...tuft.rotation];
        spike.scale = tuft.scale;
        spike.mesh(geometry.cone(5, 0.01, 0.8), tuft.color, 0.82);
      }

      // Eyebrow low-poly facet ridge
      const eyebrow = mane.add(node("eyebrow-ridge", [side * 0.36, 0.48, 0.72]));
      eyebrow.rotation[2] = side * 0.22;
      eyebrow.scale = [0.32, 0.11, 0.12];
      eyebrow.mesh(geometry.cone(5, 0.02, 0.75), colors.foxOrange, 0.82);
    }

    return mane;
  };
})();
