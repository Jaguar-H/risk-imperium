import { defend } from "../server_calls.js";
import { displayTroopSelector, setTroopLimit } from "../utilities.js";
import { handleCombat } from "./resolve_combat.js";

const handleDefense = async (gameState, territoryId, troopCount) => {
  const defendData = { territoryId, troopCount };
  const { action, data } = await defend(defendData);
  gameState.state = action;
  await handleCombat(data, action, gameState);
};

export const handleDefend = (territory, gameState, event) => {
  const territoryId = Number(territory.dataset.territoryId);

  const defendHandler = async (troopCount) =>
    await handleDefense(gameState, territoryId, troopCount);

  const troopCount = gameState.territories[territoryId].troopCount;
  const maxTroops = Math.min(2, troopCount);
  const minTroops = 1;
  setTroopLimit(maxTroops, minTroops, maxTroops);
  displayTroopSelector(event, defendHandler);
};
