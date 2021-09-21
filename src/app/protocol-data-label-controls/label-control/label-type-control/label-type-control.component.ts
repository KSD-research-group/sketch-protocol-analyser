import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, Input } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { LabelService } from '../../label.service';
import { LabelType } from './label-type';

@Component({
  selector: 'app-label-type-control',
  templateUrl: './label-type-control.component.html',
  styleUrls: ['./label-type-control.component.css'],
})
export class LabelTypeControlComponent {
  @Input() types: LabelType[] = [];
  @Input() labelGroupId!: string;

  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  constructor(private labelService: LabelService) {}

  add(event: MatChipInputEvent): void {
    if (event.value.length > 0) {
      this.labelService.addType(event.value, this.labelGroupId);
      event.chipInput!.clear();
    }
  }
}
