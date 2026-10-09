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

    // 3D Floating coins & Orbits - Background rings contouring the wolf
    const orbits = gear.add(node("orbits-group"));

    // Ring 1: Outer framing ring behind the wolf (z = -1.2 to stay behind head/hat/ears)
    const ring1Node = orbits.add(node("orbit-ring-1-group", [0, 0.1, -1.2]));
    ring1Node.rotation = [0.15, 0, 0.22];
    const ring1 = ring1Node.add(node("orbit-ring-1"));
    ring1.scale = [1.18, 1.15, 1];
    ring1.mesh(geometry.torus(2.35, 0.012, 32, 8), [0.82, 0.62, 0.22], 0.4);

    // Ring 2: Inner framing ring behind the wolf (z = -1.15)
    const ring2Node = orbits.add(node("orbit-ring-2-group", [0, 0.1, -1.15]));
    ring2Node.rotation = [-0.2, 0.12, -0.38];
    const ring2 = ring2Node.add(node("orbit-ring-2"));
    ring2.scale = [1.1, 1.08, 1];
    ring2.mesh(geometry.torus(1.95, 0.01, 32, 8), [0.92, 0.72, 0.26], 0.35);

    // Coins attached to orbit rings
    const coinsGroup = gear.add(node("orbit-coins-group"));

    // 8 coins distributed along the 2 orbit paths
    const coinConfigs = [
      // Ring 1 coins (radius ~2.35, scaled by ring scale)
      { ring: 1, angle: 0.2, radiusX: 2.35 * 1.18, radiusY: 2.35 * 1.15, size: 0.14, speed: 0.6 },
      { ring: 1, angle: 1.7, radiusX: 2.35 * 1.18, radiusY: 2.35 * 1.15, size: 0.12, speed: 0.6 },
      { ring: 1, angle: 3.3, radiusX: 2.35 * 1.18, radiusY: 2.35 * 1.15, size: 0.15, speed: 0.6 },
      { ring: 1, angle: 4.8, radiusX: 2.35 * 1.18, radiusY: 2.35 * 1.15, size: 0.11, speed: 0.6 },

      // Ring 2 coins (radius ~1.95, scaled by ring scale)
      { ring: 2, angle: 0.8, radiusX: 1.95 * 1.1, radiusY: 1.95 * 1.08, size: 0.13, speed: -0.5 },
      { ring: 2, angle: 2.4, radiusX: 1.95 * 1.1, radiusY: 1.95 * 1.08, size: 0.10, speed: -0.5 },
      { ring: 2, angle: 4.0, radiusX: 1.95 * 1.1, radiusY: 1.95 * 1.08, size: 0.14, speed: -0.5 },
      { ring: 2, angle: 5.4, radiusX: 1.95 * 1.1, radiusY: 1.95 * 1.08, size: 0.12, speed: -0.5 },
    ];

    coinConfigs.forEach((cfg, idx) => {
      const coinParent = coinsGroup.add(node(`orbit-coin-parent-${idx}`, [0, 0.1, cfg.ring === 1 ? -1.2 : -1.15]));
      coinParent.rotation = cfg.ring === 1 ? [0.15, 0, 0.22] : [-0.2, 0.12, -0.38];

      const coinNode = coinParent.add(node("orbit-coin", [0, 0, 0]));
      coinNode.userData = { ...cfg, baseAngle: cfg.angle };

      const coinBody = coinNode.add(node("coin-body"));
      coinBody.rotation[0] = Math.PI / 2;
      coinBody.mesh(geometry.cylinder(12, cfg.size, cfg.size), colors.gold, 0.25);
      coinBody.scale = [1, cfg.size * 0.28, 1];

      const coinRim = coinNode.add(node("coin-rim", [0, 0, cfg.size * 0.18]));
      coinRim.mesh(geometry.torus(cfg.size * 0.65, cfg.size * 0.10, 12, 6), colors.hatGold, 0.24);

      const coinCenter = coinNode.add(node("coin-emblem", [0, 0, cfg.size * 0.2]));
      coinCenter.mesh(geometry.ellipsoid(0, 0, 0, cfg.size * 0.17, cfg.size * 0.17, cfg.size * 0.025, 7, 4, [0xffda7b, 0xc18a36, 0xf4c05a]), [1, 1, 1], 0.25);
    });

    return gear;
  };
})();
