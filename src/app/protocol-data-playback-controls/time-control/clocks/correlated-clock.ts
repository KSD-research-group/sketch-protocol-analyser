import { Subject } from 'rxjs';
import { Clock } from './clock';
import { Correlation } from './correlation';
import { ClockOptions } from './clock-options';

export class CorrelatedClock extends Clock {
  private _correlation: Correlation;
  private tickTimer: any;
  private tickRate: number;

  tick = new Subject<number>();

  constructor(parentClock: Clock, options?: ClockOptions) {
    super('', 0, parentClock.speed);
    const opts = options || new ClockOptions();
    this._correlation = opts.correlation;
    this.parent = parentClock;
    this.parent.change.subscribe(() => this.keepUp());
    this.name = opts.name;
    this.speed = opts.speed;
    this.tickRate = opts.tickRate;
  }

  private keepUp() {
    this.correlation = new Correlation(this.parentSeconds, this.getSeconds());
  }

  get seconds() {
    return this.getSeconds();
  }

  private getSeconds() {
    const x1 = this.correlation.parentSeconds;
    const x2 = (this.parent && this.parent.seconds) || 0;
    const y1 = this.correlation.childSeconds;
    const y = this.speed * (x2 - x1) + y1;
    return y;
  }

  get correlation() {
    return this._correlation;
  }

  set correlation(val: Correlation) {
    this._correlation = val;
    this.notify('correlation');
  }

  get parentSeconds() {
    return (this.parent && this.parent.seconds) || 0;
  }

  set speed(val: number) {
    this.keepUp();
    console.log('set speed', val);
    super.speed = val;
  }

  get speed() {
    return super.speed;
  }

  startTick() {
    if (this.tickTimer) {
      clearTimeout(this.tickTimer);
    }
    this.tickTimer = setInterval(() => this.doTick(), this.tickRate);
  }

  doTick() {
    if (this.speed > 0) {
      this.tick.next(this.seconds);
    }
  }

  stopTick() {
    if (this.tickTimer) {
      clearTimeout(this.tickTimer);
    }
  }
}
