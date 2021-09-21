import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { VideoStateService } from 'src/app/protocol-data-playback-controls/video/video-state.service';
import { VideoManager } from '../video/video-manager';

@Component({
  selector: 'app-volume-control',
  templateUrl: './volume-control.component.html',
  styleUrls: ['./volume-control.component.css'],
})
export class VolumeControlComponent {
  @Input('for') for!: string;
  manager!: VideoManager;
  muted = false;

  constructor(private videoManagerFac: VideoStateService) {
    this.videoManagerFac.managerAvailable.subscribe(() => {
      this.manager = this.videoManagerFac.getVideoManager(this.for);
      // this.muted = this.manager.muted;
      // this.manager.onmutechange.subscribe(
      //   () => (this.muted = this.manager.muted)
      // );
    });
  }

  togglemute(event: MouseEvent) {
    event.stopPropagation();
    this.manager.muted = !this.manager.muted;
  }
}
