(() => {
  "use strict";

  const { node, geometry, colors } = window.LoboPirata;

  window.LoboPirata.parts.face = (root) => {
    const face = root.add(node("fox-face"));

    // Main low-poly face mesh
    face.mesh(geometry.wolfHead(), colors.foxOrange, 0.82);

    // Faceted cheeks / cheekbones
    for (const side of [-1, 1]) {
      const cheek = face.add(node("cheek-facet", [side * 0.48, -0.05, 0.52]));
      cheek.scale = [0.38, 0.32, 0.22];
      cheek.rotation[2] = side * 0.15;
      cheek.mesh(geometry.cone(5, 0.02, 0.7), colors.foxAmber, 0.8);

      const lowerCheek = face.add(node("lower-cheek-facet", [side * 0.42, -0.35, 0.58]));
      lowerCheek.scale = [0.3, 0.28, 0.18];
      lowerCheek.mesh(geometry.cone(5, 0.02, 0.7), colors.foxOrange, 0.84);
    }

    // Nasal bridge
    const bridge = face.add(node("nasal-bridge", [0, 0.08, 0.72]));
    bridge.scale = [0.18, 0.42, 0.12];
    bridge.mesh(geometry.cone(6, 0.02, 0.8), colors.foxOrange, 0.82);

    // Forehead central diamond/facet ridge
    const forehead = face.add(node("forehead-ridge", [0, 0.52, 0.62]));
    forehead.rotation[2] = Math.PI;
    forehead.scale = [0.22, 0.38, 0.14];
    forehead.mesh(geometry.cone(5, 0.02, 0.75), colors.foxAmber, 0.82);

    return face;
  };
})();
