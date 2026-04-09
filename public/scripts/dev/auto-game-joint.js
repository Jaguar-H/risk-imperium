import { delay } from "../utilities.js";

const handleLobby = async () => {
  const response = await fetch("/get-lobby-data");

  const data = await response.json();

  if (data.data.status === "in-game") {
    globalThis.location = "/game.html";
    clearInterval(id);
  }
};

const increaseDot = () => {
  const element = document.querySelector("#waiting");
  element.append(".");
};

const login = async (name) => {
  const d = await fetch("/dev/login", {
    method: "POST",
    body: JSON.stringify({ name }),
  });

  return d;
};

const handleAddToLobby = async () => {
  await fetch("/quick-play", {
    method: "POST",
    body: JSON.stringify({ name }),
  });
};

globalThis.onload = async () => {
  const name = `User-${Date.now()}`;
  await login(name);

  await delay(1000);

  await handleAddToLobby();

  await delay(1000);
  while (true) {
    await handleLobby();
    increaseDot();
    await delay(200);
  }
};
