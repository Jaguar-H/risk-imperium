import { APIs } from "./configs/APIS.js";
import {
  sendPostRequest,
  skipFortificationRequest,
  skipInvasionRequest,
} from "./server_calls.js";
import { setTroopLimit } from "./utilities.js";
import { USER_ACTIONS } from "./configs/user_action.js";

import {
  renderGameState,
  renderRemainingTroopsToDeploy,
} from "./utilities/render_UI.js";
import {
  highlightTerritories,
  removeHighlights,
} from "./utilities/highlight.js";
import { STATES } from "./configs/game_states.js";
import { getCard } from "./features/cards.js";

const setupInitialReinforcementPhase = async (gameState) => {
  const { data } = await sendPostRequest(APIs.USER_ACTIONS, {
    userActions: USER_ACTIONS.SETUP,
  });

  const territories = gameState.player.territories;
  renderRemainingTroopsToDeploy(data.troopsToReinforce);
  highlightTerritories(territories);
};

const setupReinforcePhase = async (gameState) => {
  const { data } = await sendPostRequest(APIs.USER_ACTIONS, {
    userActions: USER_ACTIONS.SETUP,
  });

  const territories = gameState.player.territories;
  setTroopLimit(data.troopsToReinforce);
  renderRemainingTroopsToDeploy(data.troopsToReinforce);
  highlightTerritories(territories);
};

const addInvasionSkipButton = (gameState) => {
  const skipButtonTemplate = document.querySelector(
    "#skip-button-template",
  );

  const cloneNode = skipButtonTemplate.content.cloneNode(true);
  const body = document.querySelector("body");
  const skipButtonElement = cloneNode.querySelector("#skip-button");

  skipButtonElement.addEventListener("click", async () => {
    const { action: newState } = await skipInvasionRequest();

    setUpNextPhase(gameState, newState);
    removeHighlights("selected");
    skipButtonElement.remove();
  });
  body.append(cloneNode);
};

const setupInvasionPhase = (gameState) => {
  const territoryIds = gameState.player.territories;
  const attackableTerritories = territoryIds.filter((territoryId) => {
    return gameState.territories[territoryId].troopCount > 1;
  });

  addInvasionSkipButton(gameState);

  removeHighlights("selected");
  highlightTerritories(attackableTerritories);
};

export const setupFortification = (gameState) => {
  const skipButtonTemplate = document.querySelector(
    "#skip-button-template",
  );

  const cloneNode = skipButtonTemplate.content.cloneNode(true);
  const body = document.querySelector("body");
  const skipButtonElement = cloneNode.querySelector("#skip-button");

  skipButtonElement.addEventListener("click", async () => {
    const { action: newState } = await skipFortificationRequest();

    setUpNextPhase(gameState, newState);
    skipButtonElement.remove();
  });
  body.append(cloneNode);
};

export const SETUP_TRANSITION = {
  [STATES.INITIAL_REINFORCEMENT]: setupInitialReinforcementPhase,
  [STATES.REINFORCE]: setupReinforcePhase,
  [STATES.INVASION]: setupInvasionPhase,
  [STATES.FORTIFICATION]: setupFortification,
  [STATES.GET_CARD]: getCard,
};

export const setUpNextPhase = (gameState, nextState) => {
  if (gameState.state === nextState) {
    return;
  }

  renderGameState(nextState);

  gameState.state = nextState;
  if (nextState in SETUP_TRANSITION) {
    return SETUP_TRANSITION[nextState](gameState);
  }
};
