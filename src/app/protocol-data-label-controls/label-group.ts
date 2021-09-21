import { LabelInstance } from './label-control/label-instance-control/label-instance';
import { LabelType } from './label-control/label-type-control/label-type';
import { RawLabelGroup } from './raw-label-group.interface';

export class LabelGroup {
  constructor(
    public id: string,
    public name: string,
    public types: LabelType[],
    public instances: LabelInstance[]
  ) {
    this.instances = instances || [];
  }

  toSerialisable(): RawLabelGroup {
    return {
      id: this.id,
      name: this.name,
      types: this.types.map((t) => t.toSerialisable()),
      instances: this.instances.map((i) => i.toSerialisable()),
    };
  }
}
