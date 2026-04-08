import { combat } from "../server_calls.js";
import {
  resolveCombatMsg,
  showNotification,
} from "../utilities/notifications.js";
import { setUpNextPhase } from "../transition_handlers.js";
import { delay, updateTroopsInTerritories } from "../utilities.js";

export const handleCombat = async (gameState) => {
  const { action: newState, data } = await combat();

  const message = resolveCombatMsg(gameState, "you", data);
  await delay(2000);

  updateTroopsInTerritories(gameState, data.updatedTerritories);
  showNotification(message, data.notifyMsg.status);

  setUpNextPhase(gameState, newState);
};
