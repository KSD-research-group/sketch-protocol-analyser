import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { TimeService } from '../time-control/time.service';
import { VideoStateService } from './video-state.service';
import { VideoSynchroniser } from './video-synchroniser';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.css'],
})
export class VideoComponent implements AfterViewInit {
  @Input('id') id!: string;
  @Input('muted') muted!: boolean;
  @ViewChild('video') video!: ElementRef<HTMLVideoElement>;

  paused = true;
  timeMS = 0;

  constructor(private state: VideoStateService) {}

  ngAfterViewInit() {
    if (this.video) {
      const video = this.video.nativeElement;
      const manager = this.state.getVideoManager(this.id, video);
      manager.muted = this.muted;
    }
  }
}
