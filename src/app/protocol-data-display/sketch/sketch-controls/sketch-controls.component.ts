import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatButtonToggleGroup } from '@angular/material/button-toggle';
import { KeyboardService } from 'src/app/keyboard.service';
import { CorrelatedClock } from 'src/app/protocol-data-playback-controls/time-control/clocks/correlated-clock';
import { Correlation } from 'src/app/protocol-data-playback-controls/time-control/clocks/correlation';
import { Schedule } from 'src/app/protocol-data-playback-controls/time-control/clocks/schedule';
import {
  RecordCorrelation,
  TimeService,
} from 'src/app/protocol-data-playback-controls/time-control/time.service';
import { SketchControlService } from './sketch-control.service';

export enum SelectType {
  STROKE,
  POINT,
  BRUSH,
  UNBRUSH,
  SELECT_ALL,
  UNSELECT_ALL,
}

@Component({
  selector: 'app-sketch-controls',
  templateUrl: './sketch-controls.component.html',
  styleUrls: ['./sketch-controls.component.css'],
})
export class SketchControlsComponent implements AfterViewInit {
  selectType = SelectType;
  timeMS = 0;
  clock?: CorrelatedClock;

  @ViewChild('selectTypeGroup') selectTypeGroup!: MatButtonToggleGroup;

  constructor(
    private contoller: SketchControlService,
    private keyboard: KeyboardService,
    private time: TimeService
  ) {
    this.keyboard.down.subscribe((key) => this.handleKeyDown(key));
    this.clock = this.time.getSlaveClock('sketch');
    this.clock.tick.subscribe((seconds) => (this.timeMS = seconds * 1000));
    this.time.correlationsChanged.subscribe((corrs) =>
      this.setCorrelations(corrs)
    );
  }

  ngAfterViewInit() {
    this.setSelectType();
  }

  private setCorrelations(correlations: RecordCorrelation[]): void {
    console.log('set correlations sketch');
    if (correlations.length && this.clock && this.clock.parent) {
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
      if (this.clock) {
        this.clock.speed = corr.sy;
        this.clock.correlation = new Correlation(seconds, corr.ty / 1000);
      }
    };
    return { seconds, action };
  }

  rotate() {
    this.contoller.rotate90();
  }

  setSelectType() {
    this.contoller.setSelectType(this.selectTypeGroup.value);
  }

  handleKeyDown(key: string) {
    switch (key) {
      case 'p':
        this.selectTypeGroup.value = SelectType.POINT;
        break;
      case 's':
        this.selectTypeGroup.value = SelectType.STROKE;
        break;
      case 'b':
        this.selectTypeGroup.value = SelectType.BRUSH;
        break;
      case 'n':
        this.selectTypeGroup.value = SelectType.UNBRUSH;
        break;
      case 'a':
        if (this.keyboard.isPressed('Control'))
          this.selectTypeGroup.value = SelectType.SELECT_ALL;
        break;
      case 'u':
        if (this.keyboard.isPressed('Control'))
          this.selectTypeGroup.value = SelectType.UNSELECT_ALL;
        break;
    }
    this.setSelectType();
  }
}
