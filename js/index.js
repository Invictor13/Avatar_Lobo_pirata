(() => {
  "use strict";

  const { node, parts, renderer } = window.LoboPirata;
  const canvas = document.getElementById("portrait");
  const status = document.getElementById("status");

  const model = node("wolf-pirate");
  const ears = parts.ears(model);
  const hat = parts.hat(model);
  const head = parts.head(model);
  const accessories = parts.accessories(model);
  const face = head.userData;

  let view;
  try {
    view = renderer.create(canvas, model);
  } catch (error) {
    status.textContent = `Não foi possível iniciar o modelo 3D: ${error.message}`;
    status.hidden = false;
    console.error(error);
    return;
  }

  let dragging = false;
  let previousX = 0;
  let previousY = 0;
  let zoom = 7.4;
  let userYaw = 0;
  let userPitch = 0;
  let blinkStartedAt = -1;
  let nextBlinkAt = 1.8;
  const headScaleY = head.scale[1];
  view.setCameraDistance(zoom);

  canvas.addEventListener("pointerdown", (event) => {
    dragging = true;
    previousX = event.clientX;
    previousY = event.clientY;
    canvas.setPointerCapture(event.pointerId);
  });

  canvas.addEventListener("pointermove", (event) => {
    if (!dragging) return;
    userYaw += (event.clientX - previousX) * 0.008;
    userPitch = Math.max(-0.62, Math.min(0.62, userPitch + (event.clientY - previousY) * 0.007));
    previousX = event.clientX;
    previousY = event.clientY;
  });

  const finishDrag = () => { dragging = false; };
  canvas.addEventListener("pointerup", finishDrag);
  canvas.addEventListener("pointercancel", finishDrag);

  canvas.addEventListener("wheel", (event) => {
    event.preventDefault();
    zoom = Math.max(5.4, Math.min(11, zoom + Math.sign(event.deltaY) * 0.24));
    view.setCameraDistance(zoom);
  }, { passive: false });

  const easeInOut = (value) => {
    const t = Math.max(0, Math.min(1, value));
    return t * t * (3 - 2 * t);
  };

  const animate = (time) => {
    const seconds = time * 0.001;
    const idleSway = dragging ? 0 : Math.sin(seconds * 0.55);
    model.rotation[0] = userPitch + idleSway * 0.022;
    model.rotation[1] = userYaw + idleSway * 0.16;
    head.scale[1] = headScaleY * (1 + Math.sin(seconds * 2.1) * 0.006);

    if (seconds >= nextBlinkAt && blinkStartedAt < 0) blinkStartedAt = seconds;
    let blink = 0;
    if (blinkStartedAt >= 0) {
      const blinkProgress = (seconds - blinkStartedAt) / 0.19;
      if (blinkProgress >= 1) {
        blinkStartedAt = -1;
        nextBlinkAt = seconds + 2.5 + (Math.sin(seconds * 1.37) + 1) * 1.25;
      } else {
        blink = Math.sin(Math.PI * easeInOut(blinkProgress));
      }
    }

    face.eyelid.scale[1] = 0.001 + blink * 0.145;
    face.eyelid.position[1] = -blink * 0.006;
    face.eyeball.scale[1] = 0.12 * (1 - blink * 0.94);
    face.iris.scale[1] = 0.092 * (1 - blink * 0.97);
    face.pupil.scale[1] = 0.071 * (1 - blink * 0.98);

    const phrasePhase = seconds % 6.6;
    const talking = phrasePhase < 2.85
      ? Math.pow(Math.max(0, Math.sin(phrasePhase * 8.8)), 1.15) *
        (0.35 + Math.max(0, Math.sin(phrasePhase * 2.4)) * 0.65)
      : 0;
    face.jaw.rotation[0] = talking * 0.43;
    face.mouthCavity.scale[1] = 0.009 + talking * 0.09;
    face.tongue.scale[1] = 0.025 + talking * 0.033;
    face.tongue.position[1] = 0.005 - talking * 0.018;

    const skullGem = hat.children[hat.children.length - 1];
    skullGem.scale[1] = 0.055 + (Math.sin(seconds * 2.4) + 1) * 0.008;
    for (const coin of accessories.children) {
      if (coin.name === "floating-coin") coin.rotation[1] = seconds * 0.7;
    }

    ears.children[0].rotation[2] = 0.12 + Math.sin(seconds * 1.7) * 0.012;
    ears.children[3].rotation[2] = -0.12 - Math.sin(seconds * 1.7) * 0.012;
    view.render();
    window.requestAnimationFrame(animate);
  };
  window.requestAnimationFrame(animate);

  canvas.addEventListener("webglcontextlost", (event) => {
    event.preventDefault();
    status.textContent = "A cena 3D perdeu o contexto gráfico. Recarregue a página para tentar novamente.";
    status.hidden = false;
  });
})();
