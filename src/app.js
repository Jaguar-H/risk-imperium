import { Hono } from "hono";
import { serveStatic } from "hono/deno";
import { handleUserActions } from "./handlers/user_actions.js";
import { handleGameSetup } from "./handler.js";
import { handleLoadGameState } from "./handlers/handleLoadGameState.js";
import { handleSaveGameState } from "./handlers/handleSaveGameState.js";

export const createApp = (
  game,
  isDevMode,
  { logger, readTextFile, writeTextFile } = {},
) => {
  const app = new Hono();

  if (logger) {
    app.use(logger());
  }

  app.use(async (context, next) => {
    context.set("game", game);
    await next();
  });

  app.get("/setup", handleGameSetup);

  app.post("/user-actions", handleUserActions);

  if (isDevMode) {
    app.get("/:state", (c) => handleLoadGameState(c, readTextFile, game));

    app.get("/save/:name", (c) => handleSaveGameState(c, writeTextFile, game));
  }
  app.get("*", serveStatic({ root: "./public" }));
  return app;
};
