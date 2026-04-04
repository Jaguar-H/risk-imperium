export class Cards {
  #cardTypes;
  constructor() {
    this.#cardTypes = ["1", "2", "3", "4"];
  }
  drawCard() {
    return this.#cardTypes[Math.round(Math.random() * 3)];
  }

  isValidCombination(combination) {
    const set = new Set();
    combination.sort((a, b) => a - b);
    const allSame = combination.every((x) => {
      return combination[0] === x || x === "4";
    });
    combination.forEach((x) => {
      set.add(x);
    });
    const allDifferent = set.size === 3;

    return allDifferent || allSame;
  }
}
