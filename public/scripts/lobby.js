const createPlayerElement = (name) => {
  const profileContainer = document.createElement("div");
  const avatar = document.createElement("player-avatar");
  const playerName = document.createElement("div");
  avatar.className = name;
  playerName.textContent = name;
  profileContainer.append(avatar, playerName);
  console.log(profileContainer);
  return profileContainer;
};

const updatePlayers = (container, players) => {
  const fragment = document.createDocumentFragment();
  players.forEach((player) =>
    fragment.appendChild(createPlayerElement(player))
  );
  container.replaceChildren(fragment);
};

const updateLobby = async (playerContainer, id) => {
  const response = await fetch("/get-lobby-data");
  const data = await response.json();
  if (response.status === 200) {
    updatePlayers(playerContainer, data.playerList);
  }
  if (data.start) {
    globalThis.location = "/";
    clearInterval(id);
  }
};

const main = () => {
  const playerContainer = document.querySelector("#players");
  updateLobby(playerContainer);
  const id = setInterval(() => {
    updateLobby(playerContainer, id);
  }, 2000);
};

globalThis.onload = main;
