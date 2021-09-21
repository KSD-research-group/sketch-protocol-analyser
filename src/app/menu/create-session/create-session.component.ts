import { Component, OnInit, ViewChild } from '@angular/core';
import { NewUser } from 'src/app/project-conf/new-user.interface';
import { ProjectConfService } from 'src/app/project-conf/project-conf.service';
import { FileSelectorComponent } from './file-selector/file-selector.component';

@Component({
  selector: 'app-create-session',
  templateUrl: './create-session.component.html',
  styleUrls: ['./create-session.component.css'],
})
export class CreateSessionComponent implements OnInit {
  @ViewChild('sketch') sketch!: FileSelectorComponent;
  @ViewChild('labels') labels!: FileSelectorComponent;
  @ViewChild('tapTranscript') tapTranscript!: FileSelectorComponent;
  @ViewChild('retroTranscript') retroTranscript!: FileSelectorComponent;
  @ViewChild('tapVideo') tapVideo!: FileSelectorComponent;
  @ViewChild('retroVideo') retroVideo!: FileSelectorComponent;
  @ViewChild('correlations') correlations!: FileSelectorComponent;

  creatable = false;
  done = false;
  currentUser?: NewUser;

  FILE_TYPE_VIDEO = 'video/mp4';
  FILE_TYPE_JSON = 'application/JSON';

  constructor(private config: ProjectConfService) {
    this.getNewUser();
  }

  ngOnInit(): void {}

  async getNewUser() {
    this.currentUser = await this.config.getNewUser();
  }

  handleChange() {
    this.creatable =
      this.sketch.selected &&
      this.labels.selected &&
      this.tapTranscript.selected &&
      this.retroTranscript.selected &&
      this.tapVideo.selected &&
      this.retroVideo.selected &&
      this.correlations.selected;

    this.done =
      this.sketch.loaded &&
      this.labels.loaded &&
      this.tapTranscript.loaded &&
      this.retroTranscript.loaded &&
      this.tapVideo.loaded &&
      this.retroVideo.loaded &&
      this.correlations.loaded;
  }

  changeUserName(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target && target.value && this.currentUser) {
      this.currentUser.name = target.value;
    }
  }

  async upload() {
    if (this.currentUser) {
      const config = await this.config.createUser(this.currentUser);

      this.sketch.uploadUrl = config.sketch.upload;
      this.sketch.upload();

      this.labels.uploadUrl = config.labels.upload;
      this.labels.upload();

      this.tapTranscript.uploadUrl = config.tapTranscript.upload;
      this.tapTranscript.upload();

      this.retroTranscript.uploadUrl = config.retroTranscript.upload;
      this.retroTranscript.upload();

      this.retroVideo.uploadUrl = config.retroVideo.upload;
      this.retroVideo.upload();

      this.tapVideo.uploadUrl = config.tapVideo.upload;
      this.tapVideo.upload();

      this.correlations.uploadUrl = config.correlations.upload;
      this.correlations.upload();
    }
  }

  apply() {
    if (this.currentUser) {
      this.config.selectUser(this.currentUser.id);
    }
  }
}
