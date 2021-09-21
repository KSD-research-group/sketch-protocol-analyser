import { LabelFactoryService } from 'src/app/protocol-data-label-controls/label-factory.service';
import { Point } from './point';

describe('Point', () => {
  it('should create an instance', () => {
    const x = 0,
      y = 0,
      p = 0,
      t = 0;
    expect(new Point({ x, y, t, p }, new LabelFactoryService())).toBeTruthy();
  });
});
