import { Component, OnInit } from '@angular/core';
import { MatSliderChange } from '@angular/material/slider';
import { VideoStateService } from 'src/app/protocol-data-playback-controls/video/video-state.service';
import { CorrelatedClock } from './clocks/correlated-clock';
import { Correlation } from './clocks/correlation';
import { TimeService } from './time.service';

@Component({
  selector: 'app-time-control',
  templateUrl: './time-control.component.html',
  styleUrls: ['./time-control.component.css'],
})
export class TimeControlComponent implements OnInit {
  min = 0;
  max = 1;
  value = 0;
  private clock: CorrelatedClock;
  private updateTimer: any;

  constructor(private time: TimeService, private video: VideoStateService) {
    this.clock = this.time.getMasterClock();
    this.clock.change.subscribe(() => this.handleClockChange());
    this.video.onduration.subscribe((timeS) => (this.max = timeS * 1000));
  }

  ngOnInit(): void {}

  onTimeSliderChange(event: MatSliderChange) {
    this.value = (event.value as number) || 0;
    const masterClock = this.time.getMasterClock();
    masterClock.correlation = new Correlation(
      (masterClock.parent && masterClock.parent.seconds) || 0,
      this.value / 1000
    );
  }

  handleClockChange() {
    if (this.clock.effectiveSpeed) {
      this.startDisplay();
    } else {
      this.stopDisplay();
    }
  }

  stopDisplay() {
    console.log('display update STOP');
    clearTimeout(this.updateTimer);
  }

  startDisplay() {
    console.log('display update START');
    if (this.updateTimer) {
      clearTimeout(this.updateTimer);
    }
    this.doUpdate();
  }

  doUpdate() {
    // Wait for next full second, than update view
    const waitFor = 1000 - ((this.clock.seconds * 1000) % 1000);
    this.updateTimer = setTimeout(() => {
      this.value = this.clock.seconds * 1000;
      this.doUpdate();
    }, waitFor);
  }
}
