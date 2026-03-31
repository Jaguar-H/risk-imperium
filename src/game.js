import { CONFIG, STATES } from "./config.js";
import { mockPlayers } from "./dummy_data.js";

export class Game {
  #activePlayerId;
  #territory;
  #players;
  #continents;
  #state;
  #initialTroopLimit;
  #randomFunction;
  #stateDetails = {};

  constructor(
    randomFunction = Math.random,
    players = mockPlayers,
    territories = CONFIG.TERRITORIES,
    continents = CONFIG.CONTINENTS,
  ) {
    this.#randomFunction = randomFunction;
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
      opponentsDetails[id] = { ...details, id };
    }
    const currentPlayerDetails = this.#players.find(({ id }) =>
      id === playerId
    );

    this.#state = STATES.INITIAL_REINFORCEMENT;
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
  getGameState() {
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
    return territories.sort(() => this.#randomFunction() - 0.5);
  }

  #initTerritory() {
    this.#players.forEach((player) => {
      player["territories"] = [];
    });
  }

  initTerritories() {
    const territoryIds = this.#shuffleTerritories(Object.keys(this.#territory));
    this.#initTerritory();

    territoryIds.forEach((territoryId, playerIndex) => {
      const territory = this.#territory[territoryId];
      territory.troopCount = 1;
      const player = this.#players[playerIndex % this.#players.length];
      player.territories.push(Number(territoryId));
    });

    this.#state = STATES.INITIAL_TERRITORY_ALLOCATION;
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
    this.#initialTroopLimit--;

    if (this.#initialTroopLimit === 0) {
      this.#state = STATES.REINFORCE;
    }

    return {
      action: this.#state,
      data: { territoryId, newTroopCount: territory.troopCount },
    };
  }

  reinforce({ territoryId, troopCount }) {
    if (this.#state === STATES.INITIAL_REINFORCEMENT) {
      return this.initialReinforcement(territoryId, troopCount);
    }

    const territory = this.#territory[territoryId];
    territory.troopCount += troopCount;

    return {
      action: this.#state,
      data: { territoryId, newTroopCount: territory.troopCount },
    };
  }

  defend(data) {
    this.#state = STATES.COMBAT;
    this.#stateDetails["defenderTroops"] = data.troopCount;
    const { attackerId, defenderId, attackerTroops, defenderTroops } =
      this.#state;
    return {
      action: this.state,
      data: { attackerId, defenderId, attackerTroops, defenderTroops },
    };
  }

  #rollDice(count) {
    return Array.from({ length: count }, Math.ceil(this.#randomFunction() * 6))
      .sort((a, b) => b - a);
  }

  #calculateLoss(defenderDice, attackerDice) {
    const attackerLoss = 0;
    const defenderLoss = 0;
    for (let index = 0; index < defenderDice.length; index++) {
      attackerDice[index] < defenderDice[index]
        ? attackerLoss++
        : defenderLoss++;
    }
    return { attackerLoss, defenderLoss };
  }

  #updateTroopCount(attackerTid, defenderTid, combatResult) {
    this.#territory[attackerTid].troopCount -= combatResult.attackerLoss;
    this.#territory[defenderTid].troopCount -= combatResult.defenderLoss;
  }

  resolveCombat() {
    const { attackerTid, defenderTid, attackerTroops, defenderTroops } =
      this.#state;
    const attackerDice = rollDice(attackerTroops);
    const defenderDice = rollDice(defenderTroops);
    const combatResult = this.#calculateLoss(defenderDice, attackerDice);
    this.#updateTroopCount(attackerTid, defenderTid, combatResult);
    this.#state = "MOVE_IN";

    return {
      action: this.#state,
      data: { attackerDice, defenderDice },
    };
  }
}
