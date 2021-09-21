import { Component, Input } from '@angular/core';
import { LabelGroup } from '../label-group';

@Component({
  selector: 'app-label-control',
  templateUrl: './label-control.component.html',
  styleUrls: ['./label-control.component.css'],
})
export class LabelControlComponent {
  @Input() labelGroup?: LabelGroup;
}
