import { Subscription } from 'rxjs';
import { LabelFactoryService } from '../../label-factory.service';
import { Label } from '../label';
import { RawLabelInstance } from './raw-label-instance.interface';

export class LabelInstance extends Label {
  typeId: string;

  private typeSubs: Subscription[] = [];

  constructor(
    id: string,
    name: string,
    typeId: string,
    private labelFac: LabelFactoryService,
    muted?: boolean,
    solo?: boolean
  ) {
    super(id, name, !!muted, !!solo);

    this.typeId = typeId;

    console.log(this.muted, this.solo);

    const type = this.labelFac.getLabelTypeById(this.typeId);

    this.setVisbilityFromLabel();

    this.typeSubs = [
      type.muteChange.subscribe((l) => this.setMuteFromLabel()),
      type.soloChange.subscribe((l) => this.setSoloFromLabel()),
      type.removed.subscribe(() => this.destroy()),
    ];
  }

  setVisbilityFromLabel() {
    this.setSoloFromLabel();
    this.setMuteFromLabel();
  }

  setSoloFromLabel() {
    const type = this.labelFac.getLabelTypeById(this.typeId);
    this.solo = !!type && !!type.solo;
    if (this.solo) {
      this.unmute();
    }
  }

  setMuteFromLabel() {
    const type = this.labelFac.getLabelTypeById(this.typeId);
    this.muted = !!type && !!type.muted;
    if (this.muted) {
      this.unsolo();
    }
  }

  destroy() {
    this.typeSubs.forEach((s) => s.unsubscribe());
    this.remove();
    console.log('destroyed');
  }

  toSerialisable(): RawLabelInstance {
    return {
      id: this.id,
      name: this.name,
      typeId: this.typeId,
      muted: this.muted,
      solo: this.solo,
    };
  }

  static fromRaw(raw: RawLabelInstance, labelFac: LabelFactoryService) {
    console.log('raw instance', raw);
    return new LabelInstance(
      raw.id,
      raw.name,
      raw.typeId,
      labelFac,
      raw.muted,
      raw.solo
    );
  }
}
