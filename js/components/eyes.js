(() => {
  "use strict";

  const { node, geometry, colors } = window.LoboPirata;
  const sphere = (width = 10, height = 8) => geometry.sphere(width, height);

  window.LoboPirata.parts.eyes = (root) => {
    const eyes = root.add(node("eyes"));
    let animatedEye;

    for (const side of [-1, 1]) {
      // side < 0 is covered by eyepatch (left side of wolf in 3D), side > 0 is visible right eye
      const eye = eyes.add(node(side < 0 ? "covered-eye" : "visible-eye", [side * 0.38, 0.28, 0.72]));
      eye.rotation[2] = -side * 0.08;

      // Eye socket recess
      const socket = eye.add(node("eye-socket", [0, 0, 0]));
      socket.scale = [0.22, 0.16, 0.08];
      socket.mesh(geometry.cone(6, 0.02, 0.7), colors.darkFur, 0.9);

      if (side > 0) {
        // Glowing orange/amber eyeball matching logo
        const eyeball = eye.add(node("glowing-eyeball", [0, 0, 0.05]));
        eyeball.scale = [0.17, 0.12, 0.07];
        eyeball.mesh(sphere(12, 8), colors.eyeGlow, 0.18);

        // Bright amber iris
        const iris = eye.add(node("amber-iris", [0.01, 0, 0.1]));
        iris.scale = [0.09, 0.09, 0.03];
        iris.mesh(sphere(10, 7), [1.0, 0.78, 0.12], 0.15);

        // Pupil (sharp vertical feline/fox pupil)
        const pupil = eye.add(node("vertical-pupil", [0.012, 0, 0.125]));
        pupil.scale = [0.025, 0.075, 0.02];
        pupil.mesh(sphere(8, 6), colors.black, 0.1);

        // Pupil glow / catchlight reflection
        const glint = eye.add(node("eye-glint", [-0.03, 0.035, 0.138]));
        glint.scale = [0.028, 0.028, 0.012];
        glint.mesh(sphere(6, 5), colors.white, 0.1);

        // Blinking eyelid
        const eyelid = eye.add(node("blinking-eyelid", [0, 0, 0.13]));
        eyelid.scale = [0.18, 0.001, 0.03];
        eyelid.mesh(sphere(10, 6), colors.foxOrange, 0.8);

        animatedEye = { eye, eyelid, eyeball, iris, pupil };
      }
    }

    return { eye: animatedEye ? animatedEye.eye : null, ...animatedEye };
  };
})();
