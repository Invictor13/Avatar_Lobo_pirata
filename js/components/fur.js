(() => {
  "use strict";

  const { node, geometry } = window.LoboPirata;

  const furOrange = [0xd84312, 0xef5617, 0xff741c, 0xc93412, 0xf68b2b, 0x9e2b15, 0xff9a38];
  const furLight = [0xf5e6d3, 0xfff0e0, 0xe5d0b8, 0xfff8ee, 0xd0beaa];
  const furRed = [0xaa2b13, 0xc23913, 0xe94d13, 0xf46b19, 0x862416];
  const maneDark = [0x231b20, 0x3e2523, 0x6d2a1b, 0x9d351a, 0x492622];

  window.LoboPirata.parts.fur = (root) => {
    const mane = root.add(node("wolf-mane-and-neck"));

    // Neck volume
    mane.mesh(geometry.ellipsoid(0, -0.55, -0.06, 0.76, 0.92, 0.43, 10, 6, maneDark), [1, 1, 1], 0.82);

    // Layered mane tufts & spikes for both sides
    for (const s of [-1, 1]) {
      const x = (v) => s * v;

      // Outer mane tuft 1 (red)
      const p1 = [
        [x(0.18), -0.30], [x(0.72), -0.40], [x(1.10), -0.63], [x(0.76), -0.61],
        [x(1.05), -0.89], [x(0.52), -0.77], [x(0.28), -1.13], [x(0.10), -0.69]
      ];
      mane.mesh(geometry.extrudedPolygon(p1, 0.26, 0.20, furRed), [1, 1, 1], 0.82);

      // Upper mane tuft (orange)
      const p2 = [
        [x(0.65), 0.22], [x(1.00), 0.31], [x(1.29), 0.07], [x(1.04), 0.02],
        [x(1.22), -0.20], [x(0.88), -0.13], [x(0.61), -0.35]
      ];
      mane.mesh(geometry.extrudedPolygon(p2, 0.32, 0.19, furOrange), [1, 1, 1], 0.82);

      // Mid mane tuft (dark red/orange)
      const p3 = [
        [x(0.69), -0.17], [x(1.02), -0.22], [x(1.24), -0.49], [x(0.94), -0.43],
        [x(1.08), -0.68], [x(0.73), -0.57], [x(0.50), -0.49]
      ];
      mane.mesh(geometry.extrudedPolygon(p3, 0.42, 0.16, [0x4c2523, 0x8a2b17, 0xc33b15, 0xf0681d]), [1, 1, 1], 0.82);

      // Lower light mane tuft
      const p4 = [
        [x(0.45), -0.55], [x(0.74), -0.63], [x(0.86), -0.99], [x(0.61), -0.86],
        [x(0.46), -1.18], [x(0.32), -0.86]
      ];
      mane.mesh(geometry.extrudedPolygon(p4, 0.45, 0.13, [0xffffff, 0xffffff, 0xfafafa]), [1, 1, 1], 0.76);
    }

    return mane;
  };
})();
