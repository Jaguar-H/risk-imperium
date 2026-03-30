import { CONFIG, STATES } from "./config.js";
import { mockPlayers } from "./dummy_data.js";

export class Game {
  #activePlayerId;
  #territory;
  #players;
  #continents;
  #state;
  #initialTroopLimit

  constructor(
    players = mockPlayers,
    territories = CONFIG.TERRITORIES,
    continents = CONFIG.CONTINENTS,
  ) {
    this.#activePlayerId = players[0].id;
    this.#territory = territories;
    this.#players = players;
    this.#continents = continents;
    this.#state = STATES.WAITING;
    this.#initialTroopLimit = 13;
  }

  getSetup(playerId) {
    const opponents = this.#players.filter(({ id }) => id !== playerId);
    const opponentsDetails = {};

    for (const { id, ...details } of opponents) {
      opponentsDetails[id] = { ...details, territories: [] };
    }
    const currentPlayerDetails = this.#players.find(({ id }) =>
      id === playerId
    );

    this.#state = STATES.INITIAL_REINFORCEMENT
    return {
      continents: this.#continents,
      territories: this.#territory,
      player: { ...currentPlayerDetails, territories: [] },
      opponents: opponentsDetails,
      cards: [],
      currentPlayer: this.#activePlayerId,
      state: this.#state,
    };
  }

  initialReinforcement(territoryId, troopCount) {
    const territory = this.#territory[territoryId];

    if (troopCount !== 1) {
      return { 
      action: this.#state, 
      data: { territoryId, newTroopCount: territory.troopCount } };
    }

    territory.troopCount++;
    this.#initialTroopLimit--;
    
    if(this.#initialTroopLimit === 0) {
      this.#state = STATES.REINFORCE;
    }

    return { 
      action: this.#state, 
      data: { territoryId, newTroopCount: territory.troopCount } };
  }

  reinforce({ territoryId, troopCount }) {
    if (this.#state === STATES.INITIAL_REINFORCEMENT) {
      return this.initialReinforcement(territoryId, troopCount);
    }

    const territory = this.#territory[territoryId];
    territory.troopCount += troopCount;

    return { action: this.#state, data: { territoryId, newTroopCount: territory.troopCount } };
  }
}
