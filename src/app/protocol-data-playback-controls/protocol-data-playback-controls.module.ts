import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProtocolDataPlaybackControlsComponent } from './protocol-data-playback-controls.component';
import { TimeControlComponent } from './time-control/time-control.component';
import { MatSliderModule } from '@angular/material/slider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PlaypauseControlComponent } from './playpause-control/playpause-control.component';
import { VolumeControlComponent } from './volume-control/volume-control.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { VideoComponent } from './video/video.component';

import { MatInputModule } from '@angular/material/input';
import { VideoControlComponent } from './video/video-control/video-control.component';
import { TimeOffsetControlComponent } from './time-control/time-offset-control/time-offset-control.component';
import { MatMenuModule } from '@angular/material/menu';

@NgModule({
  declarations: [
    ProtocolDataPlaybackControlsComponent,
    TimeControlComponent,
    PlaypauseControlComponent,
    VolumeControlComponent,
    VideoComponent,
    VideoControlComponent,
    TimeOffsetControlComponent,
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatSliderModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatExpansionModule,
    MatMenuModule,
    MatInputModule,
  ],
  exports: [ProtocolDataPlaybackControlsComponent, TimeOffsetControlComponent],
})
export class ProtocolDataPlaybackControlsModule {}
