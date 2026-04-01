import { onMapAction } from "./features/map_events.js";

export const addListenersToPlayerIcon = () => {
  const playerIcon = document.querySelector("#player-details-button");
  const playerDetailsDialog = document.querySelector(
    "#player-details-container",
  );

  const closeButton = document.querySelector(
    "#player-details-container > button",
  );

  playerIcon.addEventListener("click", () => {
    playerDetailsDialog.showModal();
  });

  closeButton.addEventListener("click", () => {
    playerDetailsDialog.close();
  });
};

export const setupListeners = (gameState) => {
  const map = document.querySelector("#game");
  map.addEventListener("click", (e) => onMapAction(e, gameState));
};
