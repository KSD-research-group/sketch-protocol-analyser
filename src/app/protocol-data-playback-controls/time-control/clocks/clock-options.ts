import { Correlation } from './correlation';

export class ClockOptions {
  correlation: Correlation;
  speed: number;
  threshold: number;
  name: string;
  tickRate: number;
  offset: number;
  constructor(
    correlation?: Correlation,
    speed?: number,
    threshold?: number,
    name?: string,
    tickRate?: number,
    offset?: number
  ) {
    this.correlation = correlation || new Correlation();
    this.speed = speed || 1;
    this.threshold = threshold || 0.1;
    this.name = name || 'unnamed clock';
    this.tickRate = tickRate || 500;
    this.offset = offset || 0;
  }
}
