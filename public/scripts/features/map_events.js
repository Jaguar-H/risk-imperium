import {
  handleInitialReinforcement,
  handleReinforcement,
} from "./reinforce.js";

const GAME_STATES = {
  INITIAL_REINFORCEMENT: handleInitialReinforcement,
  REINFORCE: handleReinforcement,
};

export const onMapAction = async (event, gameState) => {
  const territory = event.target.closest(".territory");

  if (!territory) return;

  if (gameState.state in GAME_STATES) {
    const stateToPerform = GAME_STATES[gameState.state];
    await stateToPerform(territory, gameState);
  }
};
