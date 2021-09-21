import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { ProjectConfService } from 'src/app/project-conf/project-conf.service';
import { SessionConfig } from 'src/app/project-conf/session-config.interface';
import { ClockOptions } from './clocks/clock-options';
import { CorrelatedClock } from './clocks/correlated-clock';
import { Correlation } from './clocks/correlation';
import { DateClock } from './clocks/date-clock';
import { OffsetClock } from './clocks/offset-clock';

export interface RecordCorrelation {
  tx: number;
  sx: number;
  ty: number;
  sy: number;
  ey: string;
}

@Injectable({
  providedIn: 'root',
})
export class TimeService {
  private masterClock?: CorrelatedClock;
  private slaveClocks: Record<string, OffsetClock> = {};

  clockadded = new Subject();
  correlationsChanged = new BehaviorSubject<RecordCorrelation[]>([]);

  constructor(private http: HttpClient, private config: ProjectConfService) {
    this.config.sessionInfoChanged.subscribe(
      (s) => s && this.loadCorrelations(s)
    );
  }

  loadCorrelations(config: SessionConfig) {
    this.http
      .get<RecordCorrelation[]>(config.correlations.download)
      .subscribe((c) => this.correlationsChanged.next(c));
  }

  getMasterClock() {
    if (!this.masterClock) {
      this.masterClock = this.createMasterClock();
    }
    return this.masterClock;
  }

  private createMasterClock() {
    const dateClock = new DateClock();
    const options = new ClockOptions();
    options.name = 'master-clock';
    options.correlation = new Correlation(dateClock.seconds, 0);
    options.speed = 0;
    return new CorrelatedClock(dateClock, options);
  }

  getAllSlaveClocks(): OffsetClock[] {
    return Object.keys(this.slaveClocks).map((key) => this.slaveClocks[key]);
  }

  getSlaveClock(name: string) {
    if (!this.slaveClocks[name]) {
      this.slaveClocks[name] = this.createSlaveClock(name);
      this.clockadded.next();
    }
    return this.slaveClocks[name];
  }

  private createSlaveClock(name: string) {
    const options = new ClockOptions();
    const masterClock = this.getMasterClock();
    options.name = name;
    options.speed = 1;
    options.correlation = new Correlation(masterClock.seconds, 0);
    return new OffsetClock(masterClock, options);
  }
}
