import { LabelFactoryService } from 'src/app/protocol-data-label-controls/label-factory.service';
import { Selectable } from '../selection/selectable';
import { RawPoint } from './raw-point';

export class Point extends Selectable {
  public x: number;
  public y: number;
  public p: number;
  public t: number;
  public strokeId?: number;

  constructor(rp: RawPoint, labelFac: LabelFactoryService) {
    super(labelFac, rp.labels || [], !!rp.selected, !!rp.muted, !!rp.solo);
    this.x = rp.x;
    this.y = rp.y;
    this.p = rp.p;
    this.t = rp.t;
  }

  toSerialisable(): RawPoint {
    return {
      x: this.x,
      y: this.y,
      p: this.p,
      t: this.t,
      labels: this.labels || ([] as string[]),
    };
  }
}
