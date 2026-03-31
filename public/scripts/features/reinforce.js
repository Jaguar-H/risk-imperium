import { reinforce } from "../APIS.js";
import { updateTroopCount } from "../utilities.js";

export const handleInitialReinforcement = async (territory, gameState) => {
  const territoryId = Number(territory.dataset.territoryId);
  const reinforceData = { territoryId, troopCount: 1 };
  const { action, data } = await reinforce(reinforceData);
  gameState.state = action;
  updateTroopCount(territory, data);
};
