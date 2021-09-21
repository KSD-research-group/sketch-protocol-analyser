import { Clock } from './clock';

export class DateClock extends Clock {
  constructor() {
    super('date clock');
  }

  get seconds(): number {
    return Date.now() / 1000;
  }
}
