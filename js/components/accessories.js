(() => {
  "use strict";

  const { node, geometry, colors } = window.LoboPirata;

  window.LoboPirata.parts.accessories = (root) => {
    const gear = root.add(node("pirate-accessories"));

    // Red bandana scarf around neck
    const bandanaGroup = gear.add(node("red-bandana-scarf", [0, -0.68, 0.22]));

    // Bandana collar wrap
    const bandanaWrap = bandanaGroup.add(node("bandana-collar", [0, 0, 0]));
    bandanaWrap.scale = [0.42, 0.10, 0.30];
    bandanaWrap.mesh(geometry.sphere(10, 6), colors.redBandana, 0.8);

    // Bandana front fold facets
    const bandanaFoldLeft = bandanaGroup.add(node("bandana-fold-left", [-0.12, -0.05, 0.12]));
    bandanaFoldLeft.rotation[2] = 0.35;
    bandanaFoldLeft.scale = [0.15, 0.12, 0.08];
    bandanaFoldLeft.mesh(geometry.cone(5, 0.02, 0.7), colors.redBandana, 0.82);

    const bandanaFoldRight = bandanaGroup.add(node("bandana-fold-right", [0.12, -0.05, 0.12]));
    bandanaFoldRight.rotation[2] = -0.35;
    bandanaFoldRight.scale = [0.15, 0.12, 0.08];
    bandanaFoldRight.mesh(geometry.cone(5, 0.02, 0.7), colors.redBandana, 0.82);

    const bandanaCenterTriangle = bandanaGroup.add(node("bandana-center-tip", [0, -0.10, 0.14]));
    bandanaCenterTriangle.scale = [0.18, 0.18, 0.06];
    bandanaCenterTriangle.mesh(geometry.cone(5, 0.01, 0.8), colors.darkRed, 0.85);

    // Bandana tied knot
    const bandanaKnot = bandanaGroup.add(node("bandana-knot", [0.30, -0.04, 0.10]));
    bandanaKnot.scale = [0.08, 0.08, 0.07];
    bandanaKnot.mesh(geometry.sphere(6, 5), colors.darkRed, 0.85);

    // Bandana trailing ends
    for (const [index, angle, sz] of [[0, -0.5, 0.22], [1, -0.8, 0.18]]) {
      const tail = bandanaKnot.add(node(`bandana-tail-${index}`, [0.05 + index * 0.05, -0.08 - index * 0.06, 0]));
      tail.rotation[2] = angle;
      tail.scale = [0.07, sz, 0.05];
      tail.mesh(geometry.cone(4, 0.01, 0.7), colors.redBandana, 0.82);
    }

    // 3D Floating coins & Orbits
    const orbits = gear.add(node("orbits-group"));
    const ring1 = orbits.add(node("orbit-ring-1", [0, 0.28, -0.75]));
    ring1.scale = [1.12, 1, 1];
    ring1.mesh(geometry.torus(1.83, 0.008, 24, 6), [0.46, 0.34, 0.24], 0.6);

    const ring2 = orbits.add(node("orbit-ring-2", [0, 0.28, -0.65]));
    ring2.rotation = [1.06, 0.18, -0.48];
    ring2.scale = [1, 0.96, 1];
    ring2.mesh(geometry.torus(2.12, 0.007, 24, 6), [0.46, 0.34, 0.24], 0.6);

    const coinData = [
      { p: [0.83, 2.62, -0.05], r: 0.15, rot: [0.20, 0.25, 0.37] },
      { p: [-1.27, -0.78, -0.03], r: 0.13, rot: [0.28, -0.38, 0.5] },
      { p: [1.48, -0.42, 0.02], r: 0.085, rot: [0.1, 0.2, -0.4] },
      { p: [0.99, -1.48, 0.03], r: 0.12, rot: [0.15, -0.2, 0.5] },
      { p: [-0.84, -1.88, -0.04], r: 0.07, rot: [0.3, 0.25, -0.4] }
    ];

    coinData.forEach((coin, i) => {
      const coinNode = gear.add(node("floating-coin", coin.p));
      coinNode.rotation = [...coin.rot];

      // Coin disc
      const coinMeshNode = coinNode.add(node("coin-body"));
      coinMeshNode.rotation[0] = Math.PI / 2;
      coinMeshNode.mesh(geometry.cylinder(12, coin.r, coin.r), colors.gold, 0.28);
      coinMeshNode.scale = [1, coin.r * 0.28, 1];

      // Coin rim
      const coinRim = coinNode.add(node("coin-rim", [0, 0, coin.r * 0.18]));
      coinRim.mesh(geometry.torus(coin.r * 0.65, coin.r * 0.10, 12, 6), colors.hatGold, 0.26);

      // Coin emblem
      const coinCenter = coinNode.add(node("coin-emblem", [0, 0, coin.r * 0.2]));
      coinCenter.mesh(geometry.ellipsoid(0, 0, 0, coin.r * 0.17, coin.r * 0.17, coin.r * 0.025, 7, 4, [0xffda7b, 0xc18a36, 0xf4c05a]), [1, 1, 1], 0.28);
    });

    return gear;
  };
})();
