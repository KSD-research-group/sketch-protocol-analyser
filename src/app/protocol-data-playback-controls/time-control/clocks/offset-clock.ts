import { Clock } from './clock';
import { ClockOptions } from './clock-options';
import { CorrelatedClock } from './correlated-clock';

export class OffsetClock extends CorrelatedClock {
  private _offset = 0;

  constructor(parentClock: Clock, options?: ClockOptions) {
    super(parentClock, options || new ClockOptions());
    this._offset = (options && options.offset) || 0;
  }

  set offset(val: number) {
    if (this._offset != val) {
      this._offset = val;
      this.notify('offset');
    }
  }

  get offset() {
    return this._offset;
  }

  get seconds() {
    return super.seconds + this._offset;
  }
}
