import { BehaviorSubject, Subject } from 'rxjs';
import { ProjectConfService } from '../../project-conf/project-conf.service';
import { AssetLocation } from '../../project-conf/session-config.interface';
import { TimeService } from '../time-control/time.service';
import { VideoSynchroniser } from './video-synchroniser';
import { RecordCorrelation } from '../time-control/time.service';
import { Schedule } from '../time-control/clocks/schedule';
import { OffsetClock } from '../time-control/clocks/offset-clock';
import { Correlation } from '../time-control/clocks/correlation';

export class VideoManager {
  private clock: OffsetClock;
  duration: number = 0;
  durationchange = new Subject<number>();
  urlchange = new BehaviorSubject<string | undefined>(undefined);
  mutechange = new Subject();
  pausedchange = new Subject();
  timechange = new Subject();

  constructor(
    private config: ProjectConfService,
    public id: string,
    private video: HTMLVideoElement,
    private time: TimeService
  ) {
    this.config.sessionInfoChanged.subscribe((config) => {
      if (config) {
        const url = (config[`${this.id}Video`] as AssetLocation).download;
        console.log('video.src', url);
        this.video.src = url;
      }
    });

    this.video.addEventListener('canplay', () => {
      console.log('video.canplay');
      this.setDuration(video.duration);
    });

    video.addEventListener('play', () => {
      this.pausedchange.next();
    });

    video.addEventListener('pause', () => {
      this.pausedchange.next();
    });

    video.addEventListener('timeupdate', () => {
      this.timechange.next();
    });

    this.time.correlationsChanged.subscribe((corrs) =>
      this.setCorrelations(corrs)
    );

    this.clock = this.time.getSlaveClock(this.id);
    new VideoSynchroniser(this.clock, video);
  }

  private setCorrelations(correlations: RecordCorrelation[]): void {
    console.log('set correlations', this.id);
    if (correlations.length && this.id === 'tap' && this.clock.parent) {
      // Correlations are only recorded if changed during the recording process
      // Assume opposite speed at beginning than captured at first change
      this.clock.speed = +!correlations[0].sy;

      const items = correlations.map((corr) =>
        this.recordCorrelationToScheduleItem(corr)
      );
      new Schedule(this.clock.parent, items);
    }
  }

  private recordCorrelationToScheduleItem(corr: RecordCorrelation) {
    const seconds = corr.tx / 1000;
    const action = () => {
      this.clock.speed = corr.sy;
      this.clock.correlation = new Correlation(seconds, corr.ty / 1000);
    };
    return { seconds, action };
  }

  private setDuration(duration: number) {
    this.duration = duration;
    this.durationchange.next(this.duration);
  }

  set muted(val: boolean) {
    if (val !== this.video.muted) {
      console.log('video-manager', this.id, 'muted', val);
      this.video.muted = val;
      this.mutechange.next();
    }
  }

  get muted(): boolean {
    return this.video.muted;
  }

  get paused(): boolean {
    return this.video.paused;
  }

  get timeMS(): number {
    return this.video.currentTime * 1000;
  }
}
