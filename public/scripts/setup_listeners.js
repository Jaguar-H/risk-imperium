import { onMapAction } from "./features/map_events.js";
import { highlightTerritories } from "./utilities.js";

export const setupListeners = (gameState) => {
  highlightTerritories(gameState.player.territories);

  const map = document.querySelector("#game");
  map.addEventListener("click", (e) => onMapAction(e, gameState));
};
