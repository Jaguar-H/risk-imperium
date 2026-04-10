import { beforeEach, describe, it } from "@std/testing/bdd";
import { assertEquals, assertThrows } from "@std/assert";

import { Game } from "../../src/game.js";
import { mockPlayers } from "../../src/mock_data.js";
import { FortificationController } from "../../src/handlers/fortification_controller.js";
import { Territories } from "../../src/models/territory.js";
import { CONFIG, STATES } from "../../src/config.js";

import moveIn from "../../data/tests/move_in.json" with {
  type: "json",
};

import { Continents } from "../../src/models/continents.js";
import { Cards } from "../../src/models/cards.js";
import { Cavalry } from "../../src/models/cavalry.js";
import { loadGameStateForTest } from "../utilities.js";
import { captureService } from "../../src/services/capture.js";

describe("===> RESOLVE COMBAT", () => {
  let game;
  const utilities = { random: () => 1 };
  const handlers = {
    territoriesHandler: new Territories(CONFIG.TERRITORIES),
    continentHandler: new Continents(CONFIG.CONTINENTS),
    fortificationHandler: new FortificationController(CONFIG.TERRITORIES),
    cardsHandler: new Cards(),
    cavalry: new Cavalry(),
  };

  const controllers = {};
  beforeEach(() => {
    game = new Game(mockPlayers(), handlers, controllers, utilities);
    loadGameStateForTest(game, moveIn);
  });

  it("should throw an error if the troop count is more than troop in the territory", () => {
    assertThrows(() => captureService(game, 4), Error, "Invalid troop count");
  });

  it("should throw an error if the troop count is less than zero", () => {
    assertThrows(() => captureService(game, -1), Error, "Invalid troop count");
  });

  it("should move troops", () => {
    const actualResult = captureService(game, 2);
    assertEquals(actualResult.action, STATES.INVASION);
    assertEquals(actualResult.data.updatedTerritories, [
      { territoryId: 37, troopCount: 2 },
      { territoryId: 36, troopCount: 5 },
    ]);
  });
});
