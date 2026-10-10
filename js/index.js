(() => {
  "use strict";

  const { node, parts, renderer } = window.LoboPirata;
  const canvas = document.getElementById("portrait");
  const status = document.getElementById("status");

  // Elements for Realtime Clock & Navigation
  const realtimeClock = document.getElementById("realtime-clock");
  const btnHeaderBack = document.getElementById("btn-header-back");
  const submodeOverlay = document.getElementById("submode-overlay");
  const submodeTitle = document.getElementById("submode-title");
  const dashboard = document.querySelector(".app-dashboard");
  const btnTogglePrivacy = document.getElementById("btn-toggle-privacy");
  const btnHideVal = document.getElementById("btn-hide-val");
  const valAmounts = document.querySelectorAll(".val-amount");
  const btnToggleFullscreen = document.getElementById("btn-toggle-fullscreen");

  // Realtime clock ticker
  const updateClock = () => {
    if (realtimeClock) {
      const now = new Date();
      realtimeClock.textContent = now.toLocaleTimeString("pt-BR");
    }
  };
  setInterval(updateClock, 1000);
  updateClock();

  // Mode Switching Logic
  let currentMode = "main"; // "main" or "submode"

  const enterSubmode = (titleText) => {
    currentMode = "submode";
    if (submodeTitle) submodeTitle.textContent = titleText || "Detalhamento do Ativo";
    if (submodeOverlay) submodeOverlay.classList.remove("hidden");
    if (dashboard) dashboard.classList.add("blur-bg");
    if (btnHeaderBack) btnHeaderBack.classList.remove("hidden");
  };

  const exitSubmode = () => {
    currentMode = "main";
    if (submodeOverlay) submodeOverlay.classList.add("hidden");
    if (dashboard) dashboard.classList.remove("blur-bg");
    if (btnHeaderBack) btnHeaderBack.classList.add("hidden");
  };

  // Wire back button
  if (btnHeaderBack) {
    btnHeaderBack.addEventListener("click", exitSubmode);
  }

  // Wire clickable mode elements across dashboard
  document.querySelectorAll(".clickable-mode").forEach((item) => {
    item.addEventListener("click", () => {
      const modeTitle = item.getAttribute("data-mode-title");
      enterSubmode(modeTitle);
    });
  });

  // Privacy Toggle
  let valuesHidden = false;
  const toggleValuePrivacy = () => {
    valuesHidden = !valuesHidden;
    valAmounts.forEach((el) => {
      if (valuesHidden) {
        el.setAttribute("data-real-val", el.textContent);
        el.textContent = "••••••";
      } else {
        const real = el.getAttribute("data-real-val");
        if (real) el.textContent = real;
      }
    });
  };

  if (btnTogglePrivacy) btnTogglePrivacy.addEventListener("click", toggleValuePrivacy);
  if (btnHideVal) btnHideVal.addEventListener("click", toggleValuePrivacy);

  // Fullscreen Toggle
  if (btnToggleFullscreen) {
    btnToggleFullscreen.addEventListener("click", () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else {
        if (document.exitFullscreen) document.exitFullscreen().catch(() => {});
      }
    });
  }

  // 3D Canvas setup
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

  let zoom = 7.4;
  let targetNormX = 0;
  let targetNormY = 0;
  let currentYaw = 0;
  let currentPitch = 0;
  let pupilOffsetX = 0;
  let pupilOffsetY = 0;
  let blinkStartedAt = -1;
  let nextBlinkAt = 1.8;
  let isSpinning = false;
  let spinStartSeconds = 0;
  const SPIN_DURATION = 1.2;

  const headScaleY = head.scale[1];
  view.setCameraDistance(zoom);

  // Trigger 360 spin animation
  const trigger360Spin = (currentTimeSeconds) => {
    if (!isSpinning) {
      isSpinning = true;
      spinStartSeconds = currentTimeSeconds;
    }
  };
  window.triggerLoboSpin = trigger360Spin;

  // Pointer tracking across window for head and eye movement
  window.addEventListener("pointermove", (event) => {
    targetNormX = (event.clientX / window.innerWidth - 0.5) * 2;
    targetNormY = (event.clientY / window.innerHeight - 0.5) * 2;
  });

  // Click on wolf canvas triggers 360 spin
  canvas.addEventListener("click", () => {
    const seconds = performance.now() * 0.001;
    trigger360Spin(seconds);
    if (window.LoboPirataSpeech && typeof window.LoboPirataSpeech.speakRandom === "function") {
      window.LoboPirataSpeech.speakRandom();
    }
  });

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

    // Smooth head mouse tracking
    const targetYaw = targetNormX * 0.65;
    const targetPitch = targetNormY * 0.38;
    currentYaw += (targetYaw - currentYaw) * 0.08;
    currentPitch += (targetPitch - currentPitch) * 0.08;

    // 360 Spin animation calculation
    let spinAngle = 0;
    if (isSpinning) {
      const spinProgress = (seconds - spinStartSeconds) / SPIN_DURATION;
      if (spinProgress >= 1) {
        isSpinning = false;
        spinAngle = 0;
      } else {
        spinAngle = easeInOut(spinProgress) * Math.PI * 2;
      }
    }

    const idleSway = Math.sin(seconds * 0.55);
    model.rotation[0] = currentPitch + idleSway * 0.022;
    model.rotation[1] = currentYaw + spinAngle + idleSway * 0.16;

    // Smooth eye pupil tracking
    const targetPupilX = targetNormX * 0.035;
    const targetPupilY = -targetNormY * 0.025;
    pupilOffsetX += (targetPupilX - pupilOffsetX) * 0.1;
    pupilOffsetY += (targetPupilY - pupilOffsetY) * 0.1;

    if (face.pupilNodes) {
      for (const pNode of face.pupilNodes) {
        if (pNode.iris && pNode.iris.basePosition) {
          pNode.iris.position[0] = pNode.iris.basePosition[0] + pupilOffsetX * 0.7;
          pNode.iris.position[1] = pNode.iris.basePosition[1] + pupilOffsetY * 0.7;
        }
        if (pNode.pupil && pNode.pupil.basePosition) {
          pNode.pupil.position[0] = pNode.pupil.basePosition[0] + pupilOffsetX;
          pNode.pupil.position[1] = pNode.pupil.basePosition[1] + pupilOffsetY;
        }
      }
    }

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

    const eyelidsToAnimate = face.eyelids || (face.eyelid ? [face.eyelid] : []);
    for (const lid of eyelidsToAnimate) {
      lid.scale[1] = 0.001 + blink * 1.05;
      lid.position[1] = 0.46 - blink * 0.05;
    }

    // Talking speech animation loop
    let talking = 0;
    if (window.LoboPirataSpeech && typeof window.LoboPirataSpeech.getSpeakingFactor === "function") {
      talking = window.LoboPirataSpeech.getSpeakingFactor(seconds);
    }

    if (face.jaw) face.jaw.rotation[0] = talking * 0.28;
    if (face.mouthCavity) face.mouthCavity.scale[1] = 1.0 + talking * 0.85;
    if (face.tongue) {
      face.tongue.scale[1] = 1.0 + talking * 0.35;
      face.tongue.position[1] = -talking * 0.015;
    }

    // Orbit rings subtle rotation & Floating coins orbiting along paths animation
    for (const child of accessories.children) {
      if (child.name === "orbits-group") {
        for (const ringGroup of child.children) {
          if (ringGroup.name === "orbit-ring-1-group") {
            ringGroup.rotation[2] = 0.22 + Math.sin(seconds * 0.4) * 0.05;
          } else if (ringGroup.name === "orbit-ring-2-group") {
            ringGroup.rotation[2] = -0.38 - Math.sin(seconds * 0.35) * 0.05;
          }
        }
      } else if (child.name === "orbit-coins-group") {
        for (const parentNode of child.children) {
          const coinNode = parentNode.children.find(c => c.name === "orbit-coin");
          if (coinNode && coinNode.userData) {
            const data = coinNode.userData;
            const currentAngle = data.baseAngle + seconds * data.speed;

            coinNode.position[0] = Math.cos(currentAngle) * data.radiusX;
            coinNode.position[1] = Math.sin(currentAngle) * data.radiusY;
            coinNode.position[2] = Math.sin(currentAngle * 2) * 0.05;

            coinNode.rotation[1] = currentAngle + seconds * 1.5;
            coinNode.rotation[0] = Math.sin(seconds * 2 + data.baseAngle) * 0.35;
          }
        }
      }
    }

    // Skull emblem animation
    const skullGroup = hat.children.find(c => c.name === "skull-emblem-group");
    if (skullGroup && skullGroup.userData) {
      const basePos = skullGroup.userData.basePosition;
      const baseRot = skullGroup.userData.baseRotation;

      const floatY = Math.sin(seconds * 2.2) * 0.015 + talking * 0.02;
      const tiltZ = Math.sin(seconds * 1.6) * 0.06 + Math.cos(seconds * 0.9) * 0.03;
      const pitchX = Math.cos(seconds * 2.0) * 0.04 + talking * 0.08;

      skullGroup.position[1] = basePos[1] + floatY;
      skullGroup.rotation[0] = baseRot[0] + pitchX;
      skullGroup.rotation[2] = baseRot[2] + tiltZ;
    }

    // Ear wiggles
    if (ears.children.length > 0) {
      ears.children[0].rotation[2] = -0.05 + Math.sin(seconds * 1.7) * 0.015;
    }
    if (ears.children.length > 1) {
      ears.children[1].rotation[2] = 0.05 - Math.sin(seconds * 1.7) * 0.015;
    }

    view.render(seconds);
    window.requestAnimationFrame(animate);
  };
  window.requestAnimationFrame(animate);

  canvas.addEventListener("webglcontextlost", (event) => {
    event.preventDefault();
    status.textContent = "A cena 3D perdeu o contexto gráfico. Recarregue a página para tentar novamente.";
    status.hidden = false;
  });
})();
