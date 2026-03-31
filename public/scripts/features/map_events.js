import { handleInitialReinforcement } from "./reinforce.js";
import { handleInvasion } from "./invasion.js";
const GAME_STATES = {
  INITIAL_REINFORCEMENT: handleInitialReinforcement,
  INVASION: handleInvasion,
};

export const onMapAction = async (event, gameState) => {
  const territory = event.target.closest(".territory");
  gameState.state = "INVASION";
  if (gameState.state in GAME_STATES) {
    const stateToPerform = GAME_STATES[gameState.state];
    await stateToPerform(territory, gameState);
  }
};
