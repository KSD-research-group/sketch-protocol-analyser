import { Component } from '@angular/core';
import { ProjectConfService } from './project-conf/project-conf.service';
import { SessionConfig } from './project-conf/session-config.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'sketch-protocol-analyser';
  session?: SessionConfig;
  constructor(private config: ProjectConfService) {
    this.config.sessionInfoChanged.subscribe((info) => {
      if (info) {
        this.session = info;
      }
    });
  }
}
