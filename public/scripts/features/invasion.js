import { invade } from "../APIS.js";

const highlightTerritories = (territories) => {
  territories.forEach((territoryId) => {
    const territoryElement = document.querySelector(
      `[data-territory-id="${territoryId}"]`,
    );

    territoryElement.parentElement.append(territoryElement);

    territoryElement.classList.add("highlight");
  });
};

const opponentNeighbours = (player, territories, selectedTerritoryId) => {
  const neighbours = territories[selectedTerritoryId].neighbours;
  return neighbours.filter(
    (neighbour) => !player.territories.includes(neighbour),
  );
};

const removeHighlights = () => {
  const territories = document.querySelectorAll(".territory");
  territories.forEach((territory) => {
    territory.classList.remove("highlight");
  });
};

const isMyTerritory = (gameState, attacker) => {
  return gameState.player.territories.includes(attacker);
};

const getAttackingTroop = (gameState, attacker) => {
  const troopCount = gameState.territories[attacker].troopCount;
  const attackingTroop = Math.min(troopCount - 1, 3);
  return attackingTroop;
};

const isNeighbourTerritory = (gameState, selectedTerritoryId) => {
  if (!gameState.invadeDetials) return false;
  return gameState.invadeDetials.neighbours.includes(selectedTerritoryId);
};

export const handleInvasion = async (territory, gameState) => {
  const selectedTerritoryId = territory.dataset.territoryId;
  if (isMyTerritory(gameState, selectedTerritoryId)) {
    removeHighlights();
    const neighbours = opponentNeighbours(
      gameState.player,
      gameState.territories,
      selectedTerritoryId,
    );

    gameState.invadeDetials = { attacker: selectedTerritoryId, neighbours };

    highlightTerritories(neighbours);
    return;
  }

  if (isNeighbourTerritory(gameState, +selectedTerritoryId)) {
    removeHighlights();
    const attackerId = gameState.invadeDetials.attacker;
    const defenderId = selectedTerritoryId;
    const AttackerTroops = getAttackingTroop(gameState, attackerId);
    await invade({ attackerId, defenderId, AttackerTroops });
    return;
  }
};
