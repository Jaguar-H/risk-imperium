import { getFortifiableTerritory } from "../handlers/fortified_handler.js";
import { fortifyRequest } from "../server_calls.js";
import { setUpNextPhase } from "../transition_handlers.js";
import { removeSkipButton, updateTroopsInTerritories } from "../utilities.js";
import {
  highlightTerritories,
  removeHighlights,
} from "../utilities/highlight.js";

export const handleFortified = async (territory, gameState) => {
  const id = Number(territory.dataset.territoryId);
  const territoriesSets = getFortifiableTerritory(gameState);
  const connectedTerritories = territoriesSets.find((set) => set.includes(id));

  if (!connectedTerritories) {
    return;
  }

  if (!gameState.fortifyFrom) {
    if (gameState.territories[id].troopCount < 2) {
      return;
    }

    const territoryToMoveTo = connectedTerritories.filter((tid) => tid !== id);
    removeHighlights("selected");
    highlightTerritories(territoryToMoveTo);
    gameState.fortifyFrom = id;
    return;
  }

  if (connectedTerritories.includes(gameState.fortifyFrom)) {
    gameState.fortifyTo = id;
    const fromId = gameState.fortifyFrom;
    const count = gameState.territories[fromId].troopCount - 1;
    const { action: nextPhase, data: updatedTerritories } =
      await fortifyRequest({ from: fromId, to: id, count });

    updateTroopsInTerritories(gameState, updatedTerritories);
    delete gameState.fortifyFrom;
    delete gameState.fortifyTo;
    removeSkipButton();
    setUpNextPhase(gameState, nextPhase);
  }
};
