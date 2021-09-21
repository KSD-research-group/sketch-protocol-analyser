import { LabelInstance } from 'src/app/protocol-data-label-controls/label-control/label-instance-control/label-instance';
import { RawLabelInstance } from 'src/app/protocol-data-label-controls/label-control/label-instance-control/raw-label-instance.interface';
import { RawSelectable } from '../../selection/raw-selectable.interface';

export interface RawWord extends RawSelectable {
  // id: string;
  text: string;
  time: number;
  speaker: string;
}
