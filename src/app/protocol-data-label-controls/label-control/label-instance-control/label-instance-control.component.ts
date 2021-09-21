import { Component, Input } from '@angular/core';
import { LabelInstance } from './label-instance';

let cid = 0;

@Component({
  selector: 'app-label-instance-control',
  templateUrl: './label-instance-control.component.html',
  styleUrls: ['./label-instance-control.component.css'],
})
export class LabelInstanceControlComponent {
  @Input() instances: LabelInstance[] = [];
}
