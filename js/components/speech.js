(() => {
  "use strict";

  const PIRATE_PHRASES = [
    "Ahoy, marujo! Eu sou o Lobo-Guará dos Sete Mares!",
    "Ahoooy! Procurando pelo lendário tesouro pirata?",
    "Nenhum caçador de recompensas me captura em alto mar!",
    "Ajustem as velas, içar o pavilhão negro e preparar os canhões!",
    "Iarrr! O ouro dos sete mares pertence ao Lobo Pirata!"
  ];

  let speechBubbleEl = null;
  let speechTextEl = null;
  let isSpeaking = false;
  let hideBubbleTimeout = null;
  let audioCtx = null;

  function playPirateSound() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioCtx) audioCtx = new AudioCtx();
      if (audioCtx.state === "suspended") audioCtx.resume();

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(110, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(55, audioCtx.currentTime + 0.35);

      gain.gain.setValueAtTime(0.18, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.35);
    } catch (e) {
      console.warn("Web Audio context error:", e);
    }
  }

  function initUI() {
    if (speechBubbleEl) return;

    const bubble = document.createElement("div");
    bubble.id = "speech-bubble";
    bubble.className = "speech-bubble hidden";

    const textSpan = document.createElement("span");
    textSpan.id = "speech-text";
    bubble.appendChild(textSpan);

    document.body.appendChild(bubble);

    speechBubbleEl = bubble;
    speechTextEl = textSpan;
  }

  function showBubble(text) {
    initUI();
    if (hideBubbleTimeout) clearTimeout(hideBubbleTimeout);
    speechTextEl.textContent = text;
    speechBubbleEl.classList.remove("hidden");
    speechBubbleEl.classList.add("visible");
  }

  function hideBubble() {
    if (speechBubbleEl) {
      speechBubbleEl.classList.remove("visible");
      speechBubbleEl.classList.add("hidden");
    }
  }

  function speakText(text) {
    if (!text || !text.trim()) return;

    playPirateSound();

    if (!("speechSynthesis" in window)) {
      console.warn("SpeechSynthesis API não é suportada neste navegador.");
      showBubble(text);
      setTimeout(hideBubble, 4000);
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "pt-BR";
    utterance.rate = 0.95;
    utterance.pitch = 0.85; // Deep pirate voice pitch

    // Try to find a Portuguese voice
    const voices = window.speechSynthesis.getVoices();
    const ptVoice = voices.find(v => v.lang.startsWith("pt")) || null;
    if (ptVoice) utterance.voice = ptVoice;

    showBubble(text);
    isSpeaking = true;

    utterance.onstart = () => {
      isSpeaking = true;
    };

    utterance.onend = () => {
      isSpeaking = false;
      hideBubbleTimeout = setTimeout(hideBubble, 2000);
    };

    utterance.onerror = () => {
      isSpeaking = false;
      hideBubbleTimeout = setTimeout(hideBubble, 1500);
    };

    window.speechSynthesis.speak(utterance);
  }

  function speakRandom() {
    const text = PIRATE_PHRASES[Math.floor(Math.random() * PIRATE_PHRASES.length)];
    speakText(text);
  }

  function getSpeakingFactor(timeSeconds) {
    if (!isSpeaking) {
      if (window.speechSynthesis && window.speechSynthesis.speaking) {
        isSpeaking = true;
      } else {
        return 0;
      }
    }
    // Dynamic jaw movement while speaking
    const mouthPulse = Math.pow(Math.abs(Math.sin(timeSeconds * 12)), 0.8) *
                       (0.4 + Math.sin(timeSeconds * 3.5) * 0.6);
    return mouthPulse;
  }

  window.LoboPirataSpeech = {
    speakText,
    speakRandom,
    playPirateSound,
    getSpeakingFactor,
    get isSpeaking() { return isSpeaking; }
  };

  // Setup UI Control Panel Event Listeners after DOM loads
  window.addEventListener("DOMContentLoaded", () => {
    initUI();

    const btnTalk = document.getElementById("btn-talk");
    const btnSpin = document.getElementById("btn-spin");
    const inputSpeech = document.getElementById("input-speech");
    const btnSpeakCustom = document.getElementById("btn-speak-custom");

    if (btnTalk) {
      btnTalk.addEventListener("click", () => {
        speakRandom();
      });
    }

    if (btnSpin) {
      btnSpin.addEventListener("click", () => {
        const seconds = performance.now() * 0.001;
        if (typeof window.triggerLoboSpin === "function") {
          window.triggerLoboSpin(seconds);
        }
        playPirateSound();
      });
    }

    const handleCustomSpeech = () => {
      if (inputSpeech && inputSpeech.value.trim()) {
        speakText(inputSpeech.value.trim());
      }
    };

    if (btnSpeakCustom) {
      btnSpeakCustom.addEventListener("click", handleCustomSpeech);
    }

    if (inputSpeech) {
      inputSpeech.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          handleCustomSpeech();
        }
      });
    }
  });

  // Pre-load voices
  if ("speechSynthesis" in window) {
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.getVoices();
    };
  }
})();
