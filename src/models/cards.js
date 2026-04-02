export class Cards {
  #cardTypes;
  constructor() {
    this.#cardTypes = ["1", "2", "3", "4"];
  }
  drawCard() {
    return this.#cardTypes[Math.round(Math.random() * 3)];
  }
}
