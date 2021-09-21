import { Component, OnInit } from '@angular/core';
import { LabelGroup } from './label-group';
import { LabelService } from './label.service';

@Component({
  selector: 'app-protocol-data-label-controls',
  templateUrl: './protocol-data-label-controls.component.html',
  styleUrls: ['./protocol-data-label-controls.component.css'],
})
export class ProtocolDataLabelControlsComponent {
  panelOpenState = false;
  labelData?: LabelGroup[];

  constructor(private labelDataService: LabelService) {
    console.log('ProtocolDataLabelControlsComponent.new');
    this.labelDataService.loaded.subscribe((data) => (this.labelData = data));
  }
}
