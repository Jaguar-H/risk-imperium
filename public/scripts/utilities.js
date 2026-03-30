export const longPool = async (api) => {
  const res = await fetch(api);
  if (res.status === 204) {
    return longPool(api);
  }
  return res.json();
};

export const updateTroopCount = (territory, { newTroopCount }) => {
  const troopCount = territory.querySelector(".troop-count");
  troopCount.textContent = newTroopCount;
};