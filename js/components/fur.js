(() => {
  "use strict";

  const { node, geometry, colors } = window.LoboPirata;

  window.LoboPirata.parts.fur = (root) => {
    const mane = root.add(node("facial-fur"));

    for (const side of [-1, 1]) {
      const tufts = [
        { name: "temple-spike", position: [0.7, 0.04, 0.72], angle: 2.02, scale: [0.21, 0.36, 0.14] },
        { name: "cheek-spike", position: [0.76, -0.28, 0.75], angle: 2.25, scale: [0.24, 0.44, 0.16] },
        { name: "lower-mane-spike", position: [0.57, -0.65, 0.65], angle: 2.42, scale: [0.22, 0.4, 0.14] },
        { name: "outer-mane-spike", position: [0.63, -0.49, 0.67], angle: 2.12, scale: [0.19, 0.36, 0.13] },
      ];

      for (const [index, tuft] of tufts.entries()) {
        const spike = mane.add(node(tuft.name, [
          side * tuft.position[0],
          tuft.position[1],
          tuft.position[2],
        ]));
        spike.rotation[2] = -side * tuft.angle;
        spike.scale = tuft.scale;
        spike.mesh(
          geometry.cone(9, 0.012, 0.62),
          index === 1 ? colors.rust : index === 2 ? colors.amber : colors.orange,
          0.87,
        );
      }

      const eyebrow = mane.add(node("sculpted-eyebrow", [side * 0.4, 0.49, 0.68]));
      eyebrow.rotation[2] = side * 0.14;
      eyebrow.scale = [0.3, 0.09, 0.105];
      eyebrow.mesh(geometry.sphere(18, 10), colors.orange, 0.84);
    }

    const crownFur = mane.add(node("pointed-forehead-fur", [0, 0.66, 0.52]));
    crownFur.rotation[2] = Math.PI;
    crownFur.scale = [0.15, 0.33, 0.11];
    crownFur.mesh(geometry.cone(9, 0.34, 0.025), colors.amber, 0.85);

    return mane;
  };
})();
