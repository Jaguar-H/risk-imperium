import { addListenerToTrade } from "../listeners.js";
import { showNotification } from "../utilities/notifications.js";
import { removeCardAreaListener } from "./cards.js";
import { addListenerToCard, updateCards } from "./setup.js";

const closeTradeBox = (gameState, tradeBox) => () => {
  removeCardAreaListener(gameState, "#force-trade");
  tradeBox.close();
};

export const forceTrade = (gameState) => {
  showNotification("YOU HAVE MORE THAN 5 CARDS TRADE TO CONITINUE");
  const tradeBox = document.querySelector("#force-trade");
  const cardArea = tradeBox.querySelector("div");
  const trade = tradeBox.querySelector("button");
  const playerCards = gameState.player.cards;
  const close = closeTradeBox(gameState, tradeBox);
  updateCards(playerCards, cardArea);
  addListenerToTrade(gameState, trade, close);
  addListenerToCard(gameState, tradeBox);
  tradeBox.showModal();
};
