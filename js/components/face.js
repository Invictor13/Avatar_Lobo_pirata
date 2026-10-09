(() => {
  "use strict";

  const { node, geometry, colors } = window.LoboPirata;

  window.LoboPirata.parts.face = (root) => {
    const face = root.add(node("tapered-wolf-face"));
    face.mesh(geometry.wolfHead(), colors.rust, 0.84);

    const bridge = face.add(node("blended-nasal-bridge", [0, -0.02, 0.68]));
    bridge.scale = [0.12, 0.31, 0.075];
    bridge.mesh(geometry.sphere(24, 18), [0.78, 0.31, 0.075], 0.85);

    const forehead = face.add(node("forehead-fur-ridge", [0, 0.63, 0.61]));
    forehead.rotation[2] = Math.PI;
    forehead.scale = [0.15, 0.34, 0.12];
    forehead.mesh(geometry.cone(10, 0.33, 0.035), colors.orange, 0.85);
    return face;
  };
})();
