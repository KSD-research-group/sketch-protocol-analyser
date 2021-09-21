import { Component, OnInit } from '@angular/core';
import { VideoStateService } from 'src/app/protocol-data-playback-controls/video/video-state.service';
import { CorrelatedClock } from '../time-control/clocks/correlated-clock';
import { Correlation } from '../time-control/clocks/correlation';
import { TimeService } from '../time-control/time.service';

@Component({
  selector: 'app-playpause-control',
  templateUrl: './playpause-control.component.html',
  styleUrls: ['./playpause-control.component.css'],
})
export class PlaypauseControlComponent implements OnInit {
  playing = false;
  clock: CorrelatedClock;

  constructor(private time: TimeService, private video: VideoStateService) {
    this.clock = this.time.getMasterClock();
  }

  ngOnInit(): void {}

  playpause() {
    this.playing = !this.playing;
    if (this.playing) {
      this.play();
    } else {
      this.pause();
    }
  }

  play() {
    this.clock.speed = 1;
    // this.video.play();
  }

  pause() {
    this.clock.speed = 0;
    // this.video.pause();
  }
}
