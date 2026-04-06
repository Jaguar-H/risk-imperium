import { describe, it } from "@std/testing/bdd";
import { assertEquals } from "@std/assert";
import { tradeCardHandler } from "../src/handlers/cardHandler.js";

describe("card handler tests", () => {
  it("should return action and data", () => {
    const game = {
      tradeCard: () => 1,
      getGameState: () => 2,
      lastUpdate: {},
      isTurnOf: () => false,
    };
    const result = tradeCardHandler(game, "", 1, []);
    const expected = { action: 2, data: 1 };
    assertEquals(result, expected);
  });
});
