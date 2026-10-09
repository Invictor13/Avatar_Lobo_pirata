(() => {
  "use strict";

  const { node, geometry, colors } = window.LoboPirata;
  const sphere = geometry.sphere;

  window.LoboPirata.parts.accessories = (root) => {
    const gear = root.add(node("pirate-accessories"));

    const strap = gear.add(node("leather-eyepatch-strap"));
    strap.mesh(geometry.tube([
      [-0.86, 0.58, 0.26], [-0.68, 0.48, 0.52], [-0.48, 0.43, 0.7],
      [-0.27, 0.47, 0.78], [0, 0.49, 0.77], [0.3, 0.48, 0.71],
      [0.59, 0.43, 0.59], [0.83, 0.35, 0.38],
    ], 0.052, 6), [0.095, 0.055, 0.042], 0.82);

    const patchRim = gear.add(node("gold-eyepatch-rim", [-0.405, 0.29, 0.72]));
    patchRim.rotation[2] = -0.13;
    patchRim.scale = [0.36, 0.28, 0.1];
    patchRim.mesh(geometry.sphere(9, 6), colors.gold, 0.31);

    const patch = gear.add(node("three-dimensional-eyepatch", [-0.405, 0.29, 0.79]));
    patch.rotation[2] = -0.13;
    patch.scale = [0.32, 0.245, 0.13];
    patch.mesh(sphere(7, 5), [0.11, 0.105, 0.1], 0.56);

    const patchPlate = gear.add(node("eyepatch-raised-panel", [-0.405, 0.29, 0.9]));
    patchPlate.rotation[2] = -0.13;
    patchPlate.scale = [0.24, 0.17, 0.035];
    patchPlate.mesh(sphere(5, 4), [0.23, 0.19, 0.14], 0.62);

    for (const side of [-1, 1]) {
      const rivet = gear.add(node("eyepatch-gold-rivet", [-0.405 + side * 0.22, 0.29, 0.93]));
      rivet.scale = [0.032, 0.032, 0.025];
      rivet.mesh(sphere(7, 5), colors.gold, 0.28);
    }

    for (const side of [-1, 1]) {
      const earring = gear.add(node("gold-earring", [side * 0.98, -0.02, 0.29]));
      earring.rotation[2] = side * 0.16;
      earring.scale = [0.2, 0.2, 0.16];
      earring.mesh(geometry.torus(0.37, 0.1, 14, 6), colors.gold, 0.24);

      const earringStud = gear.add(node("earring-stud", [side * 0.97, 0.19, 0.37]));
      earringStud.scale = [0.072, 0.072, 0.06];
      earringStud.mesh(sphere(8, 6), [1, 0.75, 0.28], 0.22);
    }

    const coin = (name, position, scale, rotation) => {
      const item = gear.add(node(name, position));
      item.rotation = rotation;
      item.scale = scale;
      item.mesh(geometry.torus(0.36, 0.12, 14, 6), colors.gold, 0.23);
      const embossing = item.add(node("coin-embossing", [0, 0, 0.035]));
      embossing.scale = [0.66, 0.66, 0.15];
      embossing.mesh(sphere(7, 5), [0.98, 0.69, 0.27], 0.3);
      return item;
    };

    coin("floating-coin", [1.33, 2.12, -0.06], [0.22, 0.22, 0.11], [0.26, 0.38, -0.48]);
    coin("floating-coin", [-1.3, -0.76, 0.18], [0.15, 0.15, 0.08], [0.2, -0.5, 0.55]);
    coin("floating-coin", [1.3, -1.28, -0.02], [0.2, 0.2, 0.09], [-0.42, 0.2, 0.32]);

    return gear;
  };
})();
