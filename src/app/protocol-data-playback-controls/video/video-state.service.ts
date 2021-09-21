import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { ProjectConfService } from '../../project-conf/project-conf.service';
import { TimeService } from '../time-control/time.service';
import { VideoManager } from './video-manager';

@Injectable({
  providedIn: 'root',
})
export class VideoStateService {
  private managers: Record<string, VideoManager> = {};
  private debounceDuration: any;
  private debounceAvailaility: any;

  onduration = new Subject<number>();
  managerAvailable = new Subject();

  constructor(private conf: ProjectConfService, private time: TimeService) {}

  getVideoManager(name: string, video?: HTMLVideoElement) {
    if (!this.managers[name] && video) {
      this.managers[name] = this.createVideoManager(name, video);
    }
    return this.managers[name];
  }

  private createVideoManager(name: string, video: HTMLVideoElement) {
    const manager = new VideoManager(this.conf, name, video, this.time);
    manager.durationchange.subscribe(() => this.handleDurationChange());
    manager.mutechange.subscribe(() => this.handleMuteChange(manager));
    this.notifyManagerAvailable();
    return manager;
  }

  private handleDurationChange() {
    if (this.debounceDuration) {
      clearTimeout(this.debounceDuration);
    }
    this.debounceDuration = setTimeout(() => this.notifyDurationChange(), 100);
  }

  private notifyDurationChange() {
    this.onduration.next(this.maxDuration());
  }

  private maxDuration() {
    return Math.max(
      ...Object.keys(this.managers).map((key) => this.managers[key].duration)
    );
  }

  handleMuteChange(manager: VideoManager) {
    if (!manager.muted) {
      Object.keys(this.managers).forEach((key) => {
        if (this.managers[key].id !== manager.id) {
          this.managers[key].muted = true;
        }
      });
    }
  }

  notifyManagerAvailable() {
    if (this.debounceAvailaility) {
      clearTimeout(this.debounceAvailaility);
    }
    this.debounceAvailaility = setTimeout(
      () => this.managerAvailable.next(),
      100
    );
  }
}
