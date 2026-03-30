import { CONFIG } from "./config.js";

export class Game {
  #activePlayerId;
  #territory;
  #players;
  #continents;

  constructor(
    players = [],
    territories = CONFIG.TERRITORIES,
    continents = CONFIG.CONTINENTS,
  ) {
    this.#activePlayerId = players[0].id;
    this.#territory = territories;
    this.#players = players;
    this.#continents = continents;
  }
}
