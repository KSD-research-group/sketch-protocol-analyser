export class Correlation {
  parentSeconds: number;
  childSeconds: number;
  constructor(parentSeconds?: number, childSeconds?: number) {
    this.parentSeconds = parentSeconds || 0;
    this.childSeconds = childSeconds || 0;
  }
}
