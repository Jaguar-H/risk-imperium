import { handleReinforce } from "./reinforce.js";

const USER_ACTIONS = {
  "REINFORCE": handleReinforce,
};

export const handleUserActions = async (c) => {
  const { userActions, data } = await c.req.json();
  USER_ACTIONS[userActions](data);
  return c.json({ msg: "ok" });
};
