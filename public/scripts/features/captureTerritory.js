import { NOTIFICATION_TYPES } from "../configs/notification_config.js";
import { sendCaptureRequest } from "../server_calls.js";
import { setUpNextPhase } from "../transition_handlers.js";
import {
  addListenerTroopSelector,
  displayTroopSelector,
  getIndexOf,
  getPlayerById,
  getTerritoryElementById,
  setTroopLimit,
  updateTroopsInTerritories,
} from "../utilities.js";
import { showNotification } from "../utilities/notifications.js";
import { addCardAlert, renderTradeIndicator } from "./cards.js";
import { renderPlayersDetails, updateCards } from "./setup.js";

const updatePlayerTerritories = (defender, defenderTerritoryId, gameState) => {
  const index = getIndexOf(defender.territories, defenderTerritoryId);
  gameState.player.territories.push(...defender.territories.splice(index, 1));
};

const addPlayerIdToTerritory = (gameState, defenderTerritoryId) => {
  const territoryElement = getTerritoryElementById(
    gameState.territories,
    defenderTerritoryId,
  );
  territoryElement.setAttribute("data-player", gameState.player.id);
};

const showCapturedMsg = (gameState, defenderTerritoryId) => {
  const msg = `${gameState.player.name} captured ${
    gameState.territories[defenderTerritoryId].name
  }`;

  showNotification(msg);
};

const handleElimination = (defender, gameState, combatResult) => {
  gameState.player.cards = combatResult.newCards;
  updateCards(gameState.player.cards);
  addCardAlert();
  renderTradeIndicator(gameState);
  delete gameState.opponents[defender.id];

  const msg = `${defender.name} has eliminated`;
  showNotification(msg, NOTIFICATION_TYPES.WARNING);
};

const showWinner = (player) => {
  const glassBox = document.querySelector("#glass-box");
  glassBox.classList.remove("d-none");
  const actionMenu = document.querySelector(".action-menu");
  actionMenu.classList.add("remove-events");
  const playerElement = document.querySelector("#winner-name");
  playerElement.textContent = `${player},the greate`;
};

const handlePostCapture = async (gameState, defender, troopCount) => {
  const { action, data } = await sendCaptureRequest(troopCount);
  updateTroopsInTerritories(gameState, data.updatedTerritories);

  if (data.hasEliminated) {
    handleElimination(defender, gameState, data);
  }
  renderPlayersDetails(gameState);
  if (data.hasWon) {
    // setTimeout(() => {
    //   redirect
    // })
    showWinner(gameState.player.name);
  }

  setUpNextPhase(gameState, action);
};

export const captureTerritory = (
  gameState,
  { defenderTerritoryId, attackerTerritoryId },
  combatResult,
) => {
  updateTroopsInTerritories(gameState, combatResult.updatedTerritories);

  const territoryElement = getTerritoryElementById(
    gameState.territories,
    attackerTerritoryId,
  );

  const element = territoryElement.getBoundingClientRect();

  const x = element.left;
  const y = element.top;

  const defender = getPlayerById(gameState.opponents, defenderTerritoryId);

  updatePlayerTerritories(defender, defenderTerritoryId, gameState);
  addPlayerIdToTerritory(gameState, defenderTerritoryId);
  showCapturedMsg(gameState, defenderTerritoryId);
  setTroopLimit(
    gameState.territories[attackerTerritoryId].troopCount - 1,
    combatResult.attackerDice.length,
  );

  displayTroopSelector({ x, y });

  addListenerTroopSelector((troopCount) =>
    handlePostCapture(gameState, defender, troopCount)
  );
};

// renderTradeIndicator
