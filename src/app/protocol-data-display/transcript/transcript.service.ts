import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ProjectConfService } from 'src/app/project-conf/project-conf.service';
import { SessionConfig } from 'src/app/project-conf/session-config.interface';
import { LabelInstance } from 'src/app/protocol-data-label-controls/label-control/label-instance-control/label-instance';
import { DataSelection } from '../selection/data-selection';
import { RawTranscript } from './raw-transcript.interface';
import { Transcript } from './transcript';
import { Word } from './word/word';
import { LabelFactoryService } from 'src/app/protocol-data-label-controls/label-factory.service';
import { TranscriptManager } from './transcript-manager';

@Injectable({
  providedIn: 'root',
})
export class TranscriptService {
  managers: Record<string, TranscriptManager> = {};

  constructor(
    private http: HttpClient,
    private configSvc: ProjectConfService,
    private labelFactory: LabelFactoryService
  ) {}

  getTranscriptManager(name: 'tap' | 'retro') {
    if (typeof this.managers[name] === 'undefined') {
      this.managers[name] = new TranscriptManager(
        name,
        this.http,
        this.configSvc,
        this.labelFactory
      );
    }
    return this.managers[name];
  }

  getAll() {
    return Object.keys(this.managers).map((key) => this.managers[key]);
  }
}
