import { beforeEach, describe, it } from "@std/testing/bdd";
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

  describe("init Territories", () => {
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
  });

  describe("reinforce", () => {
    it("reinforce method should return the updated troop count with the territory id", () => {
      const game = new Game();
      game.initTerritories();
      const gameState = game.getSetup();
      const expectedTroopCount = gameState.territories[37].troopCount + 1;
      const { action, data } = game.reinforce({
        territoryId: 37,
        troopCount: 1,
      });

      assertEquals(action, STATES.INITIAL_REINFORCEMENT);
      assertEquals(data.territoryId, 37);
      assertEquals(data.newTroopCount, expectedTroopCount);
    });

    it("reinforce method should not update the troop count is the troop count is invalid", () => {
      const game = new Game();
      game.initTerritories();
      const gameState = game.getSetup();
      const expectedTroopCount = gameState.territories[37].troopCount;
      const { action, data } = game.reinforce({
        territoryId: 37,
        troopCount: 3,
      });

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

      const { action, data } = game.reinforce({
        territoryId: 37,
        troopCount: 1,
      });

      assertEquals(action, STATES.REINFORCE);
      assertEquals(data.territoryId, 37);
      assertEquals(data.newTroopCount, expectedTroopCount);
    });
  });

  describe("defend", () => {
    it("should return next state and data", async () => {
      const game = new Game(() => 0.3);
      game.initTerritories();
      game.getSetup();
      const { stateDetails } = JSON.parse(
        await Deno.readTextFile("./data/states/defend.json"),
      );
      const defendData = { territoryId: "22", troopCount: 1 };
      const { action, data } = game.defend(defendData);

      assertEquals(action, STATES.RESOLVE_COMBAT);
      assertEquals(data.attackerTroops, stateDetails.attackerTroops);
      assertEquals(data.defenderTroops, stateDetails.defenderTroops);
      assertEquals(data.defenderTerritoryId, stateDetails.defenderTerritoryId);
      assertEquals(data.attackerTerritoryId, stateDetails.attackerTerritoryId);
    });
  });

  describe("combatResolve", () => {
    it("should return dice roll, new state, combat info, combat msg", () => {
      const game = new Game(() => 0.3);
      game.initTerritories();
      game.getSetup();
      const { action, data } = game.resolveCombat();
      const expected = {
        action: STATES.REINFORCE,
        data: {
          attackerDice: [2, 2, 2],
          defenderDice: [2],
          msg: "Attack successful",
          attackerTroops: 1,
          defenderTroops: 0,
        },
      };
      assertEquals(action, expected.action);
      assertEquals(data.attackerTroops, expected.data.attackerTroops);
      assertEquals(data.defenderTroops, expected.data.defenderTroops);
      assertEquals(data.defenderTerritoryId, expected.data.defenderTerritoryId);
      assertEquals(data.attackerTerritoryId, expected.data.attackerTerritoryId);
    });
  });

  describe("getSavableGameState", () => {
    let game;
    beforeEach(() => {
      game = new Game();
    });
    it("Should return new game state when game is just initialize", () => {
      const gameState = game.getSavableGameState();
      const expectedParameters = [
        "activePlayerId",
        "territory",
        "players",
        "continents",
        "state",
        "stateDetails",
      ];
      const parameters = Object.keys(gameState);
      assertEquals(expectedParameters.length, parameters.length);
      assert(parameters.every((param) => expectedParameters.includes(param)));
      assertEquals(gameState.state, STATES.SETUP);
    });

    it("Should return updated game state when game is initialize and troop initialization action is already done", () => {
      game.initTerritories();
      const gameState = game.getSavableGameState();
      const expectedParameters = [
        "activePlayerId",
        "territory",
        "players",
        "continents",
        "state",
        "stateDetails",
      ];
      const parameters = Object.keys(gameState);
      assertEquals(expectedParameters.length, parameters.length);
      assert(parameters.every((param) => expectedParameters.includes(param)));
      assertEquals(gameState.state, STATES.INITIAL_REINFORCEMENT);
    });
  });

  describe("loadGameState", () => {
    const game1 = new Game();
    game1.initTerritories();
    const initializedGameState = game1.getSavableGameState();
    let game;
    beforeEach(() => {
      game = new Game();
    });
    it("Should reset the gameState when loaded with initialGameState", () => {
      const initialGameState = game.getSavableGameState();
      game.initTerritories();
      game.loadGameState(initialGameState);
      const loadedGameState = game.getSavableGameState();
      assertEquals(loadedGameState.state, STATES.SETUP);
    });

    it("Should load the initialized game state when loaded with initializedGameState", () => {
      game.loadGameState(initializedGameState);
      const loadedGameState = game.getSavableGameState();
      assertEquals(loadedGameState.state, STATES.INITIAL_REINFORCEMENT);
    });
  });
});
