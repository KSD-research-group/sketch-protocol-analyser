import { RawLabelInstance } from "./label-control/label-instance-control/raw-label-instance.interface";
import { RawLabel } from "./label-control/raw-label.interface";

export interface RawLabelGroup {
  id: string;
  name: string;
  types: RawLabel[];
  instances?: RawLabelInstance[];
}
