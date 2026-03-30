import { assertEquals, assertRejects } from "@std/assert";
import { handleGameSetup } from "../src/handler.js";
import { describe, it } from "@std/testing/bdd";
import { Game } from "../src/game.js";
import { handleUserActions } from "../src/handlers/user_actions.js";
import { STATES } from "../src/config.js";

describe("Api Handler", () => {
  describe("handleGameSetup", () => {
    it("Should return the game setup data when called", () => {
      const setupData = { data: "this is the setup Data" };
      const store = {
        "game": {
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
      const game = new Game();
      const gameState = game.getSetup();
      gameState.state = STATES.INITIAL_REINFORCEMENT
      const context = {
        get: () => game,
        req: { json: () => ({ userActions: "REINFORCE", data: { territoryId: 37, troopCount: 1 } }) },
        json: (data) => data
      }

      const { action, data } = await handleUserActions(context);
      assertEquals(action, "INITIAL_REINFORCEMENT")
      assertEquals(data.newTroopCount, 31)
      assertEquals(data.territoryId, 37)
    });

    it("Should throw an error when the arguments are not given", () => {
      assertRejects(() => handleUserActions())
    })
  });
});
