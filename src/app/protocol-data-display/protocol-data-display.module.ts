import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProtocolDataDisplayComponent } from './protocol-data-display.component';
import { MatChipsModule } from '@angular/material/chips';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SketchVizComponent } from './sketch/sketch.component';
import { TranscriptComponent } from './transcript/transcript.component';
import { HttpClientModule } from '@angular/common/http';
import { ParagraphComponent } from './transcript/paragraph/paragraph.component';
import { WordComponent } from './transcript/word/word.component';
import { LabelsComponent } from './transcript/labels/labels.component';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { SketchControlsComponent } from './sketch/sketch-controls/sketch-controls.component';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';
import { ProtocolDataPlaybackControlsModule } from '../protocol-data-playback-controls/protocol-data-playback-controls.module';

@NgModule({
  declarations: [
    ProtocolDataDisplayComponent,
    SketchVizComponent,
    TranscriptComponent,
    ParagraphComponent,
    WordComponent,
    LabelsComponent,
    SketchControlsComponent,
  ],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    MatChipsModule,
    HttpClientModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatButtonToggleModule,
    MatTooltipModule,
    MatTabsModule,
    ProtocolDataPlaybackControlsModule
  ],
  exports: [ProtocolDataDisplayComponent],
})
export class ProtocolDataDisplayModule {}
