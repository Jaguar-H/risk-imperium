export class Cavalry {
  #positions;
  #currentPosition;
  constructor() {
    this.#positions = [4, 6, 8, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60];
    this.#currentPosition = 0;
  }
  getCurrentCount() {
    return this.#positions[this.#currentPosition];
  }
  isAtMaxPos() {
    return (this.#currentPosition + 1) === this.#positions.length;
  }
  moveCavalry() {
    if (this.isAtMaxPos()) return;
    this.#currentPosition++;
  }
  getPos(idx) {
    return this.#positions[idx];
  }
  getPositions() {
    const curr = this.#currentPosition;
    const previous = this.getPos(curr - 1) || 0;
    const current = this.getPos(curr);
    const next = this.getPos(curr + 1) || 60;
    return [previous, current, next];
  }
}
