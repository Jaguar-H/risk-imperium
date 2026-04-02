import { STATES } from "../config.js";

const isValidTerritoryForFortificaion = (to, from, _count, game) => {
  if (!game.isCurrentUserTerritory(to)) {
    return false;
  }
  if (!game.isCurrentUserTerritory(from)) {
    return false;
  }

  return to !== from;
};

export const fortificationHandler = (game, data) => {
  const state = game.getGameState();
  if (state !== STATES.FORTIFICATION) {
    return { action: state, data: [] };
  }
  const { to, from, count: troopCount } = data;

  const isValid = isValidTerritoryForFortificaion(to, from, troopCount, game);

  if (!isValid) {
    return { action: state, data: [] };
  }

  const updatedTerritories = game.fortify(from, to, troopCount);
  const newState = game.getGameState();

  return { action: newState, data: updatedTerritories };
};
