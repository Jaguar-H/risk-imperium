import { describe, it } from "@std/testing/bdd";
import { Game } from "../src/game.js";
import { assert, assertEquals } from "@std/assert";
import { STATES } from "../src/config.js";

describe("Game", () => {
  it("setup method should return data for the single user", () => {
    const game = new Game();
    const setupData = game.getSetup();
    const setupDataProperties = Object.keys(setupData);
    const expectedKeys = [
      "continents",
      "territories",
      "player",
      "opponents",
      "cards",
      "currentPlayer",
    ];

    expectedKeys.forEach((expectedKey) => {
      assert(setupDataProperties.some((key) => key === expectedKey));
    });
  });

  it("Init territories method should return the players and territories", () => {
    const game = new Game();
    const { players, territories } = game.initTerritories();
    const setupData = game.getSetup();
    assertEquals(territories, setupData.territories);
    assertEquals(
      Object.values(territories).every(({ troopCount }) => troopCount === 1),
      true,
    );
    assertEquals(
      Object.values(players).every(
        ({ territories }) => territories.length === 7,
      ),
      true,
    );
  });

  it("reinforce method should return the updated troop count with the territory id", () => {
    const game = new Game();
    game.initTerritories();
    const gameState = game.getSetup();
    const expectedTroopCount = gameState.territories[37].troopCount + 1;
    const { action, data } = game.reinforce({ territoryId: 37, troopCount: 1 });

    assertEquals(action, STATES.INITIAL_REINFORCEMENT);
    assertEquals(data.territoryId, 37);
    assertEquals(data.newTroopCount, expectedTroopCount);
  });

  it("reinforce method should not update the troop count is the troop count is invalid", () => {
    const game = new Game();
    game.initTerritories();
    const gameState = game.getSetup();
    const expectedTroopCount = gameState.territories[37].troopCount;
    const { action, data } = game.reinforce({ territoryId: 37, troopCount: 3 });

    assertEquals(action, STATES.INITIAL_REINFORCEMENT);
    assertEquals(data.territoryId, 37);
    assertEquals(data.newTroopCount, expectedTroopCount);
  });

  it("reinforce method should change the game state when all troops are deployed", () => {
    const game = new Game();
    game.initTerritories();
    const gameState = game.getSetup();
    const expectedTroopCount = gameState.territories[37].troopCount + 13;

    for (let i = 1; i <= 12; i++) {
      game.reinforce({ territoryId: 37, troopCount: 1 });
    }

    const { action, data } = game.reinforce({ territoryId: 37, troopCount: 1 });

    assertEquals(action, STATES.REINFORCE);
    assertEquals(data.territoryId, 37);
    assertEquals(data.newTroopCount, expectedTroopCount);
  });

  describe("SET REINFORCEMENTS", () => {
    it("Should set and give the reinforcement ", () => {
      const game = new Game();
      game.initTerritories();
      game.getSetup();

      for (let i = 1; i <= 13; i++) {
        game.reinforce({ territoryId: 37, troopCount: 1 });
      }

      const { action, data } = game.setupNextPhase();

      assertEquals(action, STATES.REINFORCE);
      assertEquals(data.troopsToReinforce, 3);
    });
  });

  describe("REINFORCE", () => {
    it("Should update the troop count and change the state if troops are fully deployed", () => {
      const game = new Game();
      game.initTerritories();
      game.getSetup();

      for (let i = 1; i <= 13; i++) {
        game.reinforce({ territoryId: 37, troopCount: 1 });
      }

      game.setupNextPhase();

      const { action, data } = game.reinforce({
        territoryId: 37,
        troopCount: 3,
      });

      assertEquals(action, STATES.INVADE);
      assertEquals(data.newTroopCount, 17);
      assertEquals(data.remainingTroops, 0);
    });

    it("Should update the troop only", () => {
      const game = new Game();
      game.initTerritories();
      game.getSetup();

      for (let i = 1; i <= 13; i++) {
        game.reinforce({ territoryId: 37, troopCount: 1 });
      }

      game.setupNextPhase();

      const { action, data } = game.reinforce({
        territoryId: 37,
        troopCount: 1,
      });
      assertEquals(action, STATES.REINFORCE);
      assertEquals(data.newTroopCount, 15);
      assertEquals(data.remainingTroops, 2);
    });

    it("Shouldn't change any if the count is not valid", () => {
      const game = new Game();
      game.initTerritories();

      for (let i = 1; i <= 13; i++) {
        game.reinforce({ territoryId: 37, troopCount: 1 });
      }

      game.setupNextPhase();

      const { action, data } = game.reinforce({
        territoryId: 37,
        troopCount: 0,
      });

      console.log(data);

      assertEquals(action, STATES.REINFORCE);
      assertEquals(data.newTroopCount, 14);
      assertEquals(data.remainingTroops, 3);
    });
  });
});
