import { LabelFactoryService } from 'src/app/protocol-data-label-controls/label-factory.service';
import { Point } from './point';
import { RawPoint } from './raw-point';

export class Sketch extends Array<Array<Point>> {
  toSerialisable(): RawPoint[][] {
    return this.map((points) => points.map((p) => p.toSerialisable()));
  }

  static fromRawStrokes(
    rawStrokes: RawPoint[][],
    labelFac: LabelFactoryService
  ) {
    const strokes = rawStrokes.map((rs) =>
      rs.map((rp) => new Point(rp, labelFac))
    );
    // Normalise time (first point is assigned t=0)
    const t0 = strokes[0][0].t;
    strokes.forEach((stroke, i) =>
      stroke.forEach((point) => {
        point.strokeId = i;
        point.t -= t0;
      })
    );
    return new Sketch(...strokes);
  }
}
