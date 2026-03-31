import { CONFIG, STATES } from "./config.js";
import { mockPlayers } from "./dummy_data.js";

export class Game {
  #activePlayerId;
  #territory;
  #players;
  #continents;
  #state;
  #stateDetails;

  constructor(
    players = mockPlayers(),
    territories = CONFIG.TERRITORIES,
    continents = CONFIG.CONTINENTS,
  ) {
    this.#activePlayerId = players[0].id;
    this.#territory = territories;
    this.#players = players;
    this.#continents = continents;
    this.#state = STATES.SETUP;
    this.#stateDetails = {
      initialTroopLimit: 13,
    };
  }

  getSetup(playerId) {
    const opponents = this.#players.filter(({ id }) => id !== playerId);
    const opponentsDetails = {};

    for (const { id, ...details } of opponents) {
      opponentsDetails[id] = { ...details, id };
    }
    const currentPlayerDetails = this.#players.find(
      ({ id }) => id === playerId,
    );

    return {
      continents: this.#continents,
      territories: this.#territory,
      player: { ...currentPlayerDetails },
      opponents: opponentsDetails,
      cards: [],
      currentPlayer: this.#activePlayerId,
      state: this.#state,
    };
  }

  #shuffleTerritories(territories) {
    return territories.sort(() => Math.random() - 0.5);
  }

  initTerritories() {
    const territoryIds = this.#shuffleTerritories(Object.keys(this.#territory));
    let playerIndex = 0;

    territoryIds.forEach((territoryId) => {
      const territory = this.#territory[territoryId];
      territory.troopCount = 1;
      this.#players[playerIndex % this.#players.length].territories.push(
        territoryId,
      );
      playerIndex++;
    });

    this.#state = STATES.INITIAL_REINFORCEMENT;
    this.#stateDetails.remainingTroopsToDeploy = 13;

    return { players: this.#players, territories: this.#territory };
  }

  initialReinforcement(territoryId, troopCount) {
    const territory = this.#territory[territoryId];

    if (troopCount !== 1) {
      return {
        action: this.#state,
        data: { territoryId, newTroopCount: territory.troopCount },
      };
    }

    territory.troopCount++;
    this.#stateDetails.remainingTroopsToDeploy--;

    if (this.#stateDetails.remainingTroopsToDeploy <= 0) {
      this.#state = STATES.REINFORCE;
    }

    return {
      action: this.#state,
      data: {
        territoryId,
        newTroopCount: territory.troopCount,
        remainingTroops: this.#stateDetails.remainingTroopsToDeploy,
      },
    };
  }

  reinforce({ territoryId, troopCount }) {
    const territory = this.#territory[territoryId];

    if (this.#isValidTroopCount(troopCount)) {
      return {
        action: this.#state,
        data: {
          territoryId,
          newTroopCount: territory.troopCount,
          remainingTroops: this.#stateDetails.remainingTroopsToDeploy,
        },
      };
    }

    if (this.#state === STATES.INITIAL_REINFORCEMENT) {
      return this.initialReinforcement(territoryId, troopCount);
    }

    territory.troopCount += troopCount;
    this.#stateDetails.remainingTroopsToDeploy -= troopCount;

    if (this.#stateDetails.remainingTroopsToDeploy <= 0) {
      this.#state = STATES.INVADE;
    }
    return {
      action: this.#state,
      data: {
        territoryId,
        newTroopCount: territory.troopCount,
        remainingTroops: this.#stateDetails.remainingTroopsToDeploy,
      },
    };
  }

  #isValidTroopCount(troopCount) {
    return (
      !troopCount ||
      troopCount <= 0 ||
      troopCount > this.#stateDetails.remainingTroopsToDeploy
    );
  }

  #setReinforcements() {
    this.#stateDetails.remainingTroopsToDeploy = 3;
  }

  setupNextPhase() {
    if (this.#state === STATES.REINFORCE) {
      this.#setReinforcements();
      return {
        action: this.#state,
        data: { troopsToReinforce: this.#stateDetails.remainingTroopsToDeploy },
      };
    }
  }
}
