import { Label } from '../label';
import { RawLabel } from '../raw-label.interface';

export class LabelType extends Label {
  constructor(id: string, name: string, muted?: boolean, solo?: boolean) {
    super(id, name, !!muted, !!solo);
  }

  static fromRaw(raw: RawLabel) {
    return new LabelType(raw.id, raw.name, !!raw.muted, !!raw.solo);
  }
}
