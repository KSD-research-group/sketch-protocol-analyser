import { Clock } from './clock';

export interface ScheduleItem {
  seconds: number;
  action: Function;
}

export class Schedule {
  private timer: any;

  constructor(private clock: Clock, private items: ScheduleItem[]) {
    this.clock.change.subscribe(() => {
      this.run();
    });
  }

  private run() {
    console.log('RUN schedule', this, this.clock.effectiveSpeed);
    if (this.timer) {
      clearTimeout(this.timer);
    }
    const item = this.getCurrent();
    if (item) {
      item.action();
    }
    if (this.clock.effectiveSpeed) {
      this.waitForNext();
    }
  }

  private waitForNext() {
    const item = this.getNext();
    console.log('next', item);
    if (item) {
      const timeToWait = (item.seconds - this.clock.seconds) * 1000;
      console.log('wait for', timeToWait);
      this.timer = setTimeout(() => {
        item.action();
        this.waitForNext();
      }, timeToWait);
    }
  }

  private getNext() {
    const index = this.getNextIndex();
    console.log(index);
    if (typeof index === 'undefined') {
      return null;
    } else {
      return this.items[index];
    }
  }

  private getCurrent() {
    const index = this.getNextIndex() - 1;

    if (index < -1) {
      return this.items[this.items.length - 1];
    } else {
      return this.items[index];
    }
  }

  private getNextIndex() {
    return this.items.findIndex((item) => item.seconds > this.clock.seconds);
  }
}
