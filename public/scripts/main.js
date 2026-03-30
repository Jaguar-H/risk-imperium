import {
  allocateTerritoriesAndTroops,
  mockData,
} from "../scripts/features/initialTerritoryAllocate.js";
import { setupListeners } from "./setup_listeners.js";

const getGameState = async () => await mockData;

globalThis.onload = async () => {
  // alert("Imperium");
  const gameState = await getGameState();
  allocateTerritoriesAndTroops(
    gameState.player,
    gameState.territories,
    gameState.opponents,
  );
  setupListeners()
  allocateTerritoriesAndTroops(gameState);
};
