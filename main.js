import { logger } from "hono/logger";
import { createApp } from "./src/app.js";
import { Game } from "./src/game.js";
import { Cards } from "./src/models/cards.js";
import { ContinentsHandler } from "./src/models/continents_handler.js";
import { mockPlayers } from "./src/mock_data.js";
import { CONFIG } from "./src/config.js";
import { FortificationController } from "./src/handlers/fortification_controller.js";
import { Cavalry } from "./src/models/cavalry.js";
import { TerritoriesHandler } from "./src/models/territoryHandler.js";
import { InitialReinforcementController } from "./src/handlers/initialreinforcement_controller.js";
import { ReinforcementController } from "./src/handlers/reinforcement_controller.js";
import { InvasionController } from "./src/handlers/invasion_controller.js";

const main = () => {
  const handlers = {
    continentsHandler: new ContinentsHandler(),
    cardsHandler: new Cards(),
    cavalry: new Cavalry(),
    territoriesHandler: new TerritoriesHandler(CONFIG.TERRITORIES),
  };

  const utilities = { random: Math.random };

  const controllers = {
    fortificationController: new FortificationController(CONFIG.TERRITORIES),
    initialReinforcementController: new InitialReinforcementController(
      1,
      handlers.territoriesHandler,
    ),
    reinforcementController: new ReinforcementController(
      handlers.territoriesHandler,
      handlers.continentsHandler,
    ),
    invasionController: new InvasionController(
      handlers.territoriesHandler,
      utilities.random,
    ),
  };

  const game = new Game(mockPlayers(), handlers, controllers, utilities);

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
