(() => {
  "use strict";

  const { node, geometry, colors } = window.LoboPirata;
  const sphere = geometry.sphere;

  window.LoboPirata.parts.eyes = (root) => {
    const eyes = root.add(node("eyes"));
    let animatedEye;

    for (const side of [-1, 1]) {
      const eye = eyes.add(node(side < 0 ? "covered-eye" : "visible-eye", [side * 0.405, 0.3, 0.645]));
      eye.rotation[2] = -side * 0.1;

      const socket = eye.add(node("recessed-eye-socket", [0, 0, 0.015]));
      socket.scale = [0.225, 0.155, 0.085];
      socket.mesh(sphere(20, 14), [0.075, 0.045, 0.039], 0.83);

      const eyeball = eye.add(node("golden-eyeball", [0, 0, 0.069]));
      eyeball.scale = [0.157, 0.112, 0.065];
      eyeball.mesh(sphere(22, 16), [0.9, 0.66, 0.31], 0.22);

      const iris = eye.add(node("amber-iris", [side * 0.014, 0, 0.119]));
      iris.scale = [0.074, 0.086, 0.026];
      iris.mesh(sphere(18, 13), [0.99, 0.4, 0.045], 0.2);

      const pupil = eye.add(node("vertical-pupil", [side * 0.017, 0, 0.14]));
      pupil.scale = [0.024, 0.068, 0.015];
      pupil.mesh(sphere(14, 11), [0.035, 0.022, 0.018], 0.14);

      const glint = eye.add(node("eye-catchlight", [-0.03, 0.041, 0.156]));
      glint.scale = [0.027, 0.027, 0.013];
      glint.mesh(sphere(11, 8), [1, 0.94, 0.72], 0.11);

      const eyelid = eye.add(node("blinking-eyelid", [0, 0, 0.141]));
      eyelid.scale = [0.17, 0.001, 0.028];
      eyelid.mesh(sphere(16, 10), colors.orange, 0.82);

      const rim = eye.add(node("sculpted-eye-rim"));
      rim.mesh(geometry.tube([
        [-0.22, 0, 0.016], [-0.17, 0.105, 0.028], [-0.06, 0.15, 0.038],
        [0.06, 0.147, 0.038], [0.17, 0.1, 0.028], [0.22, 0, 0.016],
      ], 0.018, 7), colors.darkFur, 0.78);
      rim.mesh(geometry.tube([
        [-0.19, -0.015, 0.021], [-0.1, -0.125, 0.035],
        [0.05, -0.145, 0.035], [0.18, -0.055, 0.021],
      ], 0.015, 6), [0.52, 0.22, 0.1], 0.83);

      if (side > 0) animatedEye = { eye, eyelid, eyeball, iris, pupil };
    }

    return { eye: animatedEye.eye, ...animatedEye };
  };
})();
