import { LabelInstance } from 'src/app/protocol-data-label-controls/label-control/label-instance-control/label-instance';
import { LabelFactoryService } from 'src/app/protocol-data-label-controls/label-factory.service';

export class Selectable {

  constructor(
    private labelFactory: LabelFactoryService,
    public labels: string[],
    public selected?: boolean,
    public muted?: boolean,
    public solo?: boolean
  ) {
    this.labels = labels || ([] as string[]);
    this.selected = !!selected;
    this.muted = !!muted;
    this.solo = !!solo;
  }

  addLabel(label: LabelInstance) {
    if (!this.hasLabel(label)) {
      this.muted ||= !!label.muted;
      this.solo ||= !!label.solo;
      this.labels.push(label.id);
    }
  }

  private hasLabel(label: LabelInstance): boolean {
    if (this.labels.findIndex((id) => id === label.id) > -1) {
      return true;
    } else {
      return false;
    }
  }

  hasLabelOfType(typeId: string): boolean {
    return (
      this.labels
        .map((id) => this.labelFactory.getLabelInstanceById(id))
        .findIndex((label) => label.typeId === typeId) >= 0
    );
  }

  hasLabelInstance(instanceId: string): boolean {
    return this.labels.findIndex((id) => id === instanceId) >= 0;
  }

  removeLabel(label: LabelInstance) {
    // console.log('remove');
    if (this.labels.length > 0) {
      const lix = this.labels.findIndex((id) => id === label.id);
      if (lix > -1) {
        this.labels.splice(lix, 1);
      }
    }
  }

  /**
   * Checks if visibility changes due to change in vis state of related labels
   * @returns visibility changed flag
   */
  evalVisibilityChange(selector: 'muted' | 'solo') {
    const currVis = this[selector];
    this[selector] = this.labels
      .map((id) => this.labelFactory.getLabelInstanceById(id))
      .reduce((res: boolean, l) => res || (l && !!l[selector]), false);
    return currVis !== this[selector];
  }
}
