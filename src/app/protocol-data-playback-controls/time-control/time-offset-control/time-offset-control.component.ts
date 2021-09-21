import { AfterViewInit, Component, Input } from '@angular/core';
import { OffsetClock } from '../clocks/offset-clock';
import { TimeService } from '../time.service';

@Component({
  selector: 'app-time-offset-control',
  templateUrl: './time-offset-control.component.html',
  styleUrls: ['./time-offset-control.component.css'],
})
export class TimeOffsetControlComponent implements AfterViewInit {
  @Input('for') for!: string;
  clock?: OffsetClock;

  constructor(private time: TimeService) {}

  ngAfterViewInit(): void {
    console.log('INIT', this.for);
    this.clock = this.time.getSlaveClock(this.for);
    this.time.clockadded.subscribe(
      () => (this.clock = this.time.getSlaveClock(this.for))
    );
  }

  setOffset(clock: OffsetClock, event: any) {
    console.log('clock:', clock.name, 'offset:', event.target.value);
    clock.offset = parseInt(event.target.value, 10) / 1000;
  }
}
