import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { VideoStateService } from '../video-state.service';

@Component({
  selector: 'app-video-control',
  templateUrl: './video-control.component.html',
  styleUrls: ['./video-control.component.css'],
})
export class VideoControlComponent {
  @Input('for') for!: string;
  paused = true;
  timeMS = 0;

  constructor(private manFac: VideoStateService) {
    this.manFac.managerAvailable.subscribe(() => this.init());
  }

  init(): void {
    const video = this.manFac.getVideoManager(this.for);
    video.pausedchange.subscribe(() => (this.paused = video.paused));
    video.timechange.subscribe(() => (this.timeMS = video.timeMS));
  }
}
