import { setup } from "./features/setup.js";
import { setupListeners } from "./setup_listeners.js";
import { allocateTerritoriesAndTroops } from "./features/initial_territory_allocate.js";
import { getSetup, sendGetRequest } from "./server_calls.js";
import { APIs } from "./APIS.js";

globalThis.onload = async () => {
  const gameState = await getSetup();

  allocateTerritoriesAndTroops(
    gameState.player,
    gameState.territories,
    gameState.opponents,
  );

  setupListeners(gameState);

  setup(gameState);
  const { players, territories } = await sendGetRequest(
    APIs.INITIAL_TERRITORIES,
  );
  renderTerritoriesAndTroops(
    players,
    territories,
  );
};
