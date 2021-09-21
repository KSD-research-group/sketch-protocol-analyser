import { RawSelectable } from '../selection/raw-selectable.interface';

export interface RawPoint extends RawSelectable {
  x: number;
  y: number;
  p: number;
  t: number;
}
