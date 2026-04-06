import { Player } from "./models/player_handler.js";

export const mockPlayers = () => {
  const players = [
    { id: 1, name: "Jon", cards: [] },
    { id: 2, name: "Rob", cards: [] },
    { id: 3, name: "Sansa", cards: [] },
    { id: 4, name: "Arya", cards: [] },
    { id: 5, name: "Rickon", cards: [] },
    { id: 6, name: "Bran", cards: [1, 2, 3] },
  ];

  return players.map(({ id, name, cards }) => new Player(id, name, cards));
};
