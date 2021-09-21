import { Subject } from 'rxjs';

export class Clock {
  private _speed: number;
  private _seconds: number;
  private _parent: Clock | undefined;

  id: string;
  change = new Subject<void>();

  constructor(public name: string, seconds?: number, speed?: number) {
    this.id = newId.next().value;
    this._seconds = seconds || 0;
    this._speed = speed || 1;
    this._parent = undefined;
  }

  get speed(): number {
    return this._speed;
  }

  set speed(val: number) {
    if (val !== this._speed) {
      this._speed = val;
      this.notify('speed');
    }
  }

  get effectiveSpeed(): number {
    let speed = 0;
    if (this.parent) {
      speed = this.speed * this.parent.effectiveSpeed;
    } else {
      speed = this.speed;
    }
    return speed;
  }

  get seconds(): number {
    return this._seconds;
  }

  get parent(): Clock | undefined {
    return this._parent;
  }

  set parent(val: Clock | undefined) {
    this._parent = val;
    this.notify('parent');
  }

  notify(what: string) {
    console.log(this.name, what, 'change', this);
    this.change.next();
  }
}

const newId = (function* generate() {
  let seed = 0;
  while (true) {
    yield `urn:sketch:clock:${seed++}`;
  }
})();
