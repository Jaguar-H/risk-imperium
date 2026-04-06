export class Cavalry {
  #positions;
  #currentPosition;
  constructor(currentPosition = 0) {
    this.#positions = [4, 6, 8, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60];
    this.#currentPosition = currentPosition;
  }

  get lastPos() {
    return this.#currentPosition;
  }
  getCurrentCount() {
    return this.#positions[this.#currentPosition];
  }

  moveToMax() {
    this.#currentPosition = this.#positions.length - 1;
    return "at max";
  }
  #isAtMaxPos() {
    return (this.#currentPosition + 1) === this.#positions.length;
  }
  moveCavalry() {
    if (this.#isAtMaxPos()) return "is at max";
    this.#currentPosition++;
    return "moved";
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
