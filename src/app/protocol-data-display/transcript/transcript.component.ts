import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';
import { Paragraph } from './paragraph/paragraph';
import { TranscriptService } from './transcript.service';
import {
  RecordCorrelation,
  TimeService,
} from 'src/app/protocol-data-playback-controls/time-control/time.service';
import { Transcript } from './transcript';
import {
  Schedule,
  ScheduleItem,
} from 'src/app/protocol-data-playback-controls/time-control/clocks/schedule';
import { Correlation } from 'src/app/protocol-data-playback-controls/time-control/clocks/correlation';
import { OffsetClock } from 'src/app/protocol-data-playback-controls/time-control/clocks/offset-clock';

// Ideas for making transcript follow playback controls

@Component({
  selector: 'app-transcript',
  templateUrl: './transcript.component.html',
  styleUrls: ['./transcript.component.css'],
})
export class TranscriptComponent implements AfterViewInit {
  @Input() id!: 'tap' | 'retro';
  @ViewChild('scrollView') scrollView?: ElementRef;
  paragraphs: Paragraph[] = [];
  labelCount = 0;

  private clock: OffsetClock;

  constructor(
    private transcriptService: TranscriptService,
    private time: TimeService
  ) {
    this.clock = this.time.getSlaveClock(`${this.id}-transcript`);
  }

  ngAfterViewInit(): void {
    const transMngr = this.transcriptService.getTranscriptManager(this.id);

    transMngr.loaded.subscribe((transcript: Transcript) => {
      if (transcript) {
        this.paragraphs = transcript.paragraphs;
        const items: ScheduleItem[] = this.paragraphs.map((p) => ({
          action: () => {
            this.scrollTo(p);
          },
          seconds: p.words[0].time / 1000,
        }));
        new Schedule(this.clock, items);
      }
    });

    transMngr.visibilityChanged.subscribe((transcript) => {
      this.paragraphs = transcript.paragraphs;
    });

    this.time.correlationsChanged.subscribe((corrs) =>
      this.setCorrelations(corrs)
    );
  }

  private scrollTo(p: Paragraph) {
    const view = this.scrollView?.nativeElement;
    const top = p ? p.element?.nativeElement.offsetTop - view.offsetTop : 0;
    view.scrollTo({
      top,
      left: 0,
      behavior: 'smooth',
    });
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
}
