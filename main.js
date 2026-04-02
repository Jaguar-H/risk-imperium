import { logger } from "hono/logger";
import { createApp } from "./src/app.js";
import { Game } from "./src/game.js";
import { Cards } from "./src/models/cards.js";
import { ContinentsHandler } from "./src/models/continents_handler.js";

const main = () => {
  const cards = new Cards();
  const continentsHandler = new ContinentsHandler();
  const game = new Game(continentsHandler, cards, Math.random);
  game.initTerritories();
  const isDevMode = Deno.env.get("DEV_MODE") === "true";
  const app = createApp(game, isDevMode, {
    logger,
    readTextFile: Deno.readTextFile,
    writeTextFile: Deno.writeTextFileSync,
  });
  const port = Deno.env.get("PORT") || 8000;
  Deno.serve({ port }, app.fetch);
};

main();
