import { setup } from "./features/setup.js";
import { setupListeners } from "./setup_listeners.js";
import {
  allocateTerritoriesAndTroops,
  mockData,
} from "../scripts/features/initialTerritoryAllocate.js";

const getGameState = async () => await mockData;

globalThis.onload = async () => {
  const gameState = await getGameState();

  allocateTerritoriesAndTroops(
    gameState.player,
    gameState.territories,
    gameState.opponents,
  );
  setupListeners()
  setup(gameState);
};
