const USER_ACTIONS = {
  "REINFORCE": (game, data) => game.reinforce(data),
};

export const handleUserActions = async (c) => {
  const game = c.get("game");
  const { userActions, data } = await c.req.json();

  const result = USER_ACTIONS[userActions](game, data);
  return c.json(result);
};
