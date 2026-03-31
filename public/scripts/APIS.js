import { sendPostRequest } from "./server_calls.js";

export const APIs = {
  SETUP: "/setup",
  USER_ACTIONS: "/user-actions",
  INITIAL_TERRITORIES: "/initial-territories",
};

export const invade = async (invasionDetails) => {
  const reqData = { userActions: "INVADE", data: invasionDetails };
  return await sendPostRequest("/user-actions", reqData);
};
