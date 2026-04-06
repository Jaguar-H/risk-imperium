import { STATES } from "../config.js";
import { sendUpdatesToPlayers } from "../utilities.js";

export const tradeCardHandler = (
  game,
  userData,
  _currentPlayerId,
  opponents,
) => {
  const cards = userData.cards;

  const data = game.tradeCard(cards);
  const action = game.getGameState();
  const lastUpdate = game.lastUpdate;

  sendUpdatesToPlayers(STATES.WAITING, lastUpdate, opponents);

  return { action, data };
};
