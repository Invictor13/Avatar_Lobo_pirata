(() => {
  "use strict";

  const { node, geometry, colors } = window.LoboPirata;

  window.LoboPirata.parts.face = (root) => {
    const face = root.add(node("fox-face"));

    // Main low-poly face mesh
    face.mesh(geometry.wolfHead(), colors.foxOrange, 0.82);

    // Faceted cheeks / cheekbones
    for (const side of [-1, 1]) {
      const cheek = face.add(node("cheek-facet", [side * 0.52, 0.02, 0.42]));
      cheek.scale = [0.42, 0.38, 0.25];
      cheek.rotation[2] = side * 0.18;
      cheek.mesh(geometry.cone(5, 0.02, 0.7), colors.foxAmber, 0.8);

      const lowerCheek = face.add(node("lower-cheek-facet", [side * 0.45, -0.32, 0.48]));
      lowerCheek.scale = [0.32, 0.3, 0.2];
      lowerCheek.mesh(geometry.cone(5, 0.02, 0.7), colors.foxOrange, 0.84);
    }

    // Nasal bridge
    const bridge = face.add(node("nasal-bridge", [0, 0.12, 0.58]));
    bridge.scale = [0.2, 0.48, 0.15];
    bridge.mesh(geometry.cone(6, 0.02, 0.8), colors.foxOrange, 0.82);

    // Forehead central diamond/facet ridge
    const forehead = face.add(node("forehead-ridge", [0, 0.55, 0.48]));
    forehead.rotation[2] = Math.PI;
    forehead.scale = [0.25, 0.4, 0.15];
    forehead.mesh(geometry.cone(5, 0.02, 0.75), colors.foxAmber, 0.82);

    return face;
  };
})();
