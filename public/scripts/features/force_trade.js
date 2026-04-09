import { NOTIFICATION_MESSAGES } from "../configs/notification_config.js";
import { addListenerToTrade } from "../listeners.js";
import { showNotification } from "../utilities/notifications.js";
import { removeCardAreaListener } from "./cards.js";
import { addListenerToCard, updateCards } from "./setup.js";

const closeTradeBox = (gameState, tradeBox) => () => {
  removeCardAreaListener(gameState, "#force-trade");
  tradeBox.close();
};

export const forceTrade = (gameState) => {
  showNotification(NOTIFICATION_MESSAGES.FORCE_TRADE);

  const tradeBox = document.querySelector("#force-trade");
  const trade = tradeBox.querySelector("button");
  const playerCards = gameState.player.cards;
  const close = closeTradeBox(gameState, tradeBox);

  updateCards(playerCards, "#force-trade");
  addListenerToTrade(gameState, trade, close);
  addListenerToCard(gameState, tradeBox);
  tradeBox.showModal();
};
