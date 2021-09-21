import { Component } from '@angular/core';
import { ProjectConfService } from 'src/app/project-conf/project-conf.service';
import { SessionReference } from 'src/app/project-conf/session-reference.interface';

@Component({
  selector: 'app-select-session',
  templateUrl: './select-session.component.html',
  styleUrls: ['./select-session.component.css'],
})
export class SelectSessionComponent {
  configs?: SessionReference[];

  constructor(private configService: ProjectConfService) {
    this.configService.configschange.subscribe(
      (configs) => (this.configs = configs)
    );
  }

  selectSession(id: string) {
    this.configService.selectUser(id);
  }
}
