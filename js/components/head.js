(() => {
  "use strict";

  const { node, parts } = window.LoboPirata;

  window.LoboPirata.parts.head = (root) => {
    const head = root.add(node("wolf-head"));
    head.scale = [1.12, 0.88, 1];
    parts.face(head);
    const fur = parts.fur(head);
    const eyes = parts.eyes(head);
    const muzzle = parts.muzzle(head);

    head.userData = { ...eyes, ...muzzle, fur };
    return head;
  };
})();
