import { Injectable, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProtocolDataLabelControlsComponent } from './protocol-data-label-controls.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LabelTypeControlComponent } from './label-control/label-type-control/label-type-control.component';
import { LabelInstanceControlComponent } from './label-control/label-instance-control/label-instance-control.component';
import { LabelControlComponent } from './label-control/label-control.component';
import { MatButtonModule } from '@angular/material/button';
import { ControlSetComponent } from './label-control/control-set/control-set.component';

@NgModule({
  declarations: [
    ProtocolDataLabelControlsComponent,
    LabelTypeControlComponent,
    LabelInstanceControlComponent,
    LabelControlComponent,
    ControlSetComponent,
  ],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatChipsModule,
    MatIconModule,
    MatButtonModule,
    BrowserAnimationsModule,
    MatTabsModule,
    MatListModule,
    MatExpansionModule,
  ],
  exports: [ProtocolDataLabelControlsComponent],
})
export class ProtocolDataLabelControlsModule {}
