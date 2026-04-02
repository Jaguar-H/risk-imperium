import { assertEquals } from "@std/assert";
import { beforeEach, describe, it } from "@std/testing/bdd";
import { handleGameSetup } from "../src/handler.js";
import { Game } from "../src/game.js";
import { handleUserActions } from "../src/handlers/user_actions.js";
import { ContinentsHandler } from "../src/models/continents_handler.js";

describe("Api Handler", () => {
  let game;
  beforeEach(() => {
    const continentsHandler = new ContinentsHandler();
    game = new Game(continentsHandler);
  });
  describe("handleGameSetup", () => {
    it("Should return the game setup data when called", () => {
      const setupData = { data: "this is the setup Data" };
      const store = {
        game: {
          getSetup: () => setupData,
        },
      };
      const context = {
        get: (item) => store[item],
        json: (data) => data,
      };

      const actualSetupData = handleGameSetup(context);
      assertEquals(actualSetupData, setupData);
    });
  });

  describe("handleUserActions", () => {
    it("Should handle user actions when called", async () => {
      game.initTerritories();
      const context = {
        get: () => game,
        req: {
          json: () => ({
            userActions: "REINFORCE",
            data: { territoryId: 37, troopCount: 1 },
          }),
        },
        json: (data) => data,
      };

      const { action, data } = await handleUserActions(context);

      assertEquals(action, "INITIAL_REINFORCEMENT");

      assertEquals(data.updatedTerritory.length, 1);
      const updatedTerritory = data.updatedTerritory[0];
      assertEquals(updatedTerritory.troopCount, 2);
      assertEquals(updatedTerritory.territoryId, 37);
    });

    it("Should catch an error when error occurred", async () => {
      const context = { json: (x) => x };
      const { msg } = await handleUserActions(context);
      assertEquals("context.get is not a function", msg);
    });

    it("SETUP : Should handle user actions when called", async () => {
      game.initTerritories();
      for (let i = 1; i <= 13; i++) {
        game.reinforce({ territoryId: 37, troopCount: 1 });
      }

      const context = {
        get: () => game,
        req: {
          json: () => ({ userActions: "SETUP" }),
        },
        json: (data) => data,
      };

      const { action, data } = await handleUserActions(context);

      assertEquals(action, "REINFORCE");
      assertEquals(data.troopsToReinforce, 3);
    });
  });
});
