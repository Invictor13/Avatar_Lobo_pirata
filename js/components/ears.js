(() => {
  "use strict";

  const { node, geometry, colors } = window.LoboPirata;

  window.LoboPirata.parts.ears = (root) => {
    const pair = root.add(node("ears"));
    for (const side of [-1, 1]) {
      const outer = pair.add(node(side < 0 ? "left-ear" : "right-ear", [side * 0.78, 1.23, -0.08]));
      outer.rotation[2] = -side * 0.12;
      outer.scale = [0.43, 1.3, 0.31];
      outer.mesh(geometry.cone(9, 0.025, 0.8), side < 0 ? colors.rust : colors.orange, 0.88);

      const inner = pair.add(node("inner-ear", [side * 0.8, 1.29, 0.17]));
      inner.rotation[2] = -side * 0.13;
      inner.scale = [0.265, 0.88, 0.13];
      inner.mesh(geometry.cone(7, 0.015, 0.72), colors.innerEar, 0.96);

      const innerLight = pair.add(node("inner-ear-highlight", [side * 0.8, 1.29, 0.25]));
      innerLight.rotation[2] = -side * 0.13;
      innerLight.scale = [0.15, 0.55, 0.08];
      innerLight.mesh(geometry.cone(6, 0.01, 0.67), [0.7, 0.42, 0.34], 0.94);
    }
    return pair;
  };
})();
