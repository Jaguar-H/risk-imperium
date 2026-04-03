import { NOTIFICATION_TYPES } from "../configs/notification_config.js";
import { getIndexOf, getPlayerById, getTerritoryElementById } from "../utilities.js";
import { showNotification } from "../utilities/notifications.js";
import { addCardAlert } from "./cards.js";
import { renderPlayersDetails, updateCards } from "./setup.js";


export const captureTerritory = (
  gameState,
  { defenderTerritoryId },
  combatResult,
) => {

  combatResult.updatedTerritories.forEach(({ territoryId, troopCount }) => {
    gameState.territories[territoryId].troopCount = troopCount;
  });

  const defender = getPlayerById(gameState.opponents, defenderTerritoryId);

  const index = getIndexOf(defender.territories, defenderTerritoryId);
  gameState.player.territories.push(...defender.territories.splice(index, 1));
  const territoryElement = getTerritoryElementById(
    gameState.territories,
    defenderTerritoryId,
  );
  territoryElement.setAttribute("data-player", gameState.player.id);

  const msg = `${gameState.player.name} captured ${
    gameState.territories[defenderTerritoryId].name
  }`;

  showNotification(msg);

  if (combatResult.hasEliminated) {
    const msg = `${defender.name} has eliminated`;
    gameState.player.cards = combatResult.newCards;
    updateCards(gameState.player.cards);
    addCardAlert();
    console.log(gameState);
    delete gameState.opponents[defender.id];
    showNotification(msg, NOTIFICATION_TYPES.WARNING);
  }

  renderPlayersDetails(gameState);

  if (combatResult.hasWon) {
    const glassBox = document.querySelector("#glass-box");
    glassBox.classList.remove("d-none");
    // setTimeout(() => {
    //   redirect
    // })
  }
};
