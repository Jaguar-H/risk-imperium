import { sendPostRequest } from "../server_calls.js";

const updateTroopCount = (territory, { newTroopCount }) => {
  const troopCount = territory.querySelector(".troop-count");
  troopCount.textContent = newTroopCount;
};

const openDialogBox = (territory) => {
  const territoryId = Number(territory.dataset.territoryId);
  const dialog = document.querySelector("dialog");
  dialog.showModal();

  const form = dialog.querySelector("#deploy-troops-form");
  form.onsubmit = async (e) => {
    e.preventDefault();
    const input = form.querySelector("input");
    const troopCount = input.value;
    const reqData = {
      userActions: "REINFORCE",
      data: { territoryId, troopCount: Number(troopCount) },
    };
    const { data } = await sendPostRequest("/user-actions", reqData);
    form.reset();
    updateTroopCount(territory, data);
    dialog.close();
  };
};

export const onMapAction = (event) => {
  const territory = event.target.closest("g");
  openDialogBox(territory);
};
