import { onMapAction } from "./features/map_events.js";
import { updateCards } from "./features/setup.js";

export const addListenersToPlayerIcon = () => {
  const playerIcon = document.querySelector("#player-details-button");
  const playerDetailsDialog = document.querySelector(
    "#player-details-container",
  );

  const closeButton = document.querySelector(
    "#player-details-container > button",
  );

  playerIcon.addEventListener("click", () => {
    playerDetailsDialog.classList.toggle("hidden");
  });

  closeButton.addEventListener("click", () => {
    playerDetailsDialog.classList.toggle("hidden");
  });
};

export const setupListeners = (gameState) => {
  const map = document.querySelector("#game");
  map.addEventListener("click", (e) => onMapAction(e, gameState));
};

export const addListenerToCardIcon = (player) => {
  const cardArea = document.querySelector("#card-area");
  const cardIcon = document.querySelector("#cards");

  updateCards(player.cards);

  cardIcon.addEventListener("click", () => {
    const alert = cardIcon.querySelector("circle");
    alert.classList.remove("card-alert");
    cardArea.classList.toggle("hidden");
  });
};
