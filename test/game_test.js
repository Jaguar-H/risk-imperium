import { describe, it } from "@std/testing/bdd";
import { Game } from "../src/game.js";
import { assert } from "@std/assert/assert";
import { assertEquals } from "@std/assert/equals";

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
      Object.values(players).every(({ territories }) =>
        territories.length === 7
      ),
      true,
    );
  });
});
