import { beforeEach, describe, it } from "@std/testing/bdd";
import { assertEquals } from "@std/assert/equals";
import { Player } from "../../src/models/player.js";

describe("Player", () => {
  const name = "RAJ";
  let player;
  beforeEach(() => {
    player = new Player(1, name, 1);
  });
  it("Should provide the name of the user when user.name is called", () => {
    assertEquals(player.name, name);
  });
  it("Should provide the avatar of player ", () => {
    assertEquals(player.avatar, 1);
  });
});
