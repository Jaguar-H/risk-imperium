export const tradeCardHandler = (game, userData) => {
  try {
    const cards = userData.cards;
    const data = game.tradeCard(cards);
    const action = game.getGameState();

    return { action, data };
  } catch (e) {
    console.log(e);
  }
};
