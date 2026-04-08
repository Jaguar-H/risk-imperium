import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { Player } from "../models/player_handler.js";
import { createGame } from "../create_game.js";

const createLobby = (id) => {
  return {
    id,
    players: [],
    status: "waiting",
  };
};

export const moveToLobby = (context) => {
  const lobbies = context.get("lobbies");
  const players = context.get("players");

  const playerId = Number(getCookie(context, "playerId"));
  const username = players[playerId];

  const player = new Player(+playerId, username);
  let lobby = [...lobbies.values()].find((lobby) =>
    lobby.players.length < 3 && lobby.status === "waiting"
  );

  if (!lobby) {
    const lobbyId = Date.now();
    lobby = createLobby(lobbyId);
    lobbies.set(lobbyId, lobby);
  }

  lobby.players.push(player);
  setCookie(context, "lobbyId", lobby.id);

  if (lobby.players.length === 3) {
    const gamesRepo = context.get("gamesRepo");
    const game = createGame(lobby.players);
    gamesRepo.set(lobby.id, game);
    lobby.status = "in-game";
  }

  return context.redirect("/lobby.html");
};

export const sendLobbyData = (context) => {
  const lobbies = context.get("lobbies");
  const lobbyId = getCookie(context, "lobbyId");

  const lobby = lobbies.get(Number(lobbyId));

  const data = {
    playerList: lobby.players.map((p) => p.name),
    start: lobby.status === "in-game",
  };

  if (data.start) {
    setCookie(context, "gameId", lobby.id);
  }

  return context.json(data);
};

export const leaveLobbyHandler = (context) => {
  const lobbies = context.get("lobbies");
  const lobbyId = getCookie(context, "lobbyId");

  const lobby = lobbies.get(Number(lobbyId));
  const playerId = Number(getCookie(context, "playerId"));
  const response = { data: {} };
  if (lobby.status === "waiting") {
    const playerIdx = lobby.players.findIndex((player) =>
      player.id === playerId
    );
    lobby.players.splice(playerIdx, 1);
    response.action = "LEAVE";
    response.data = { success: true };
    deleteCookie(context, "lobbyId");
  }

  return context.json(response);
};
