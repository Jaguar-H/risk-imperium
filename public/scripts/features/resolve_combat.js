import { combat } from "../APIS.js";
import { showNotification } from "../utilities.js";

const updateTroopsInMap = (territoryId, troopsCount) => {
  const territoryElement = document.querySelector(
    `[data-territory-id="${territoryId}"]`,
  );
  const troopCountElement = territoryElement.querySelector(".troop-count");
  troopCountElement.textContent = troopsCount;
};

const updateMap = (prevData, data) => {
  updateTroopsInMap(prevData.attackerTerritoryId, data.attackerTroops);
  updateTroopsInMap(prevData.defenderTerritoryId, data.defenderTroops);
  showNotification(data.msg);
};

export const handleCombat = async (prevData, _action, gameState) => {
  const { action: newAction, data } = await combat(prevData);
  const diceValues = [...data.attackerDice, ...data.defenderDice];
  const dieElements = document.querySelectorAll(".die-slot");

  dieElements.forEach((dice, index) => {
    dice.classList.toggle(".dice-roll");
    dice.textContent = diceValues[index];
  });

  gameState.state = newAction;
  updateMap(prevData, data);
};
