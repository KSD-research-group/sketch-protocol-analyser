import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { LabelInstance } from 'src/app/protocol-data-label-controls/label-control/label-instance-control/label-instance';
import { LabelFactoryService } from 'src/app/protocol-data-label-controls/label-factory.service';

@Component({
  selector: 'app-labels',
  templateUrl: './labels.component.html',
  styleUrls: ['./labels.component.css'],
})
export class LabelsComponent implements OnInit, OnChanges {
  @Input() labels: string[] = [];
  labelInstances: LabelInstance[] = [];

  constructor(public labelFac: LabelFactoryService) {}

  ngOnInit(): void {
    this.resolveLabelIds();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.resolveLabelIds();
  }

  resolveLabelIds() {
    this.labelInstances = this.labels
      .map((id) => this.labelFac.getLabelInstanceById(id))
      .filter((l) => typeof l !== 'undefined');
  }

  clickSelect(label: LabelInstance) {
    label.select();
  }

  clickRemove(label: LabelInstance) {
    label.remove();
  }
}
